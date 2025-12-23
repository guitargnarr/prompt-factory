import { useState, useEffect, useRef, useCallback } from 'react'
import { getAllNodes } from '../lib/tree-utils'

export function TreeSearch({
  tree,
  onSelectNode,
  onHighlightNodes,
  isOpen,
  onClose
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searchIn, setSearchIn] = useState('all') // 'all', 'titles', 'content'
  const inputRef = useRef(null)

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isOpen])

  // Search logic
  useEffect(() => {
    if (!tree || !query.trim()) {
      setResults([])
      onHighlightNodes?.([])
      return
    }

    const allNodes = getAllNodes(tree.root_node)
    const searchTerm = query.toLowerCase()

    const matches = allNodes.filter(node => {
      const titleMatch = node.title.toLowerCase().includes(searchTerm)
      const contentMatch = node.content?.toLowerCase().includes(searchTerm)

      if (searchIn === 'titles') return titleMatch
      if (searchIn === 'content') return contentMatch
      return titleMatch || contentMatch
    }).map(node => ({
      ...node,
      matchType: node.title.toLowerCase().includes(searchTerm) ? 'title' : 'content',
      // Create snippet for content matches
      snippet: getSnippet(node.content, searchTerm)
    }))

    setResults(matches)
    setSelectedIndex(0)
    onHighlightNodes?.(matches.map(m => m.id))
  }, [query, tree, searchIn, onHighlightNodes])

  // Clear highlights when closing
  useEffect(() => {
    if (!isOpen) {
      onHighlightNodes?.([])
    }
  }, [isOpen, onHighlightNodes])

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
      return
    }

    if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault()
      const selected = results[selectedIndex]
      if (selected) {
        onSelectNode(selected.id)
        onClose()
      }
      return
    }
  }, [results, selectedIndex, onSelectNode, onClose])

  // Navigate to result on click
  const handleResultClick = (nodeId) => {
    onSelectNode(nodeId)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Search Panel */}
      <div className="relative w-full max-w-2xl mx-4 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-700">
          <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search nodes..."
            className="flex-1 bg-transparent text-white text-lg placeholder-slate-500 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
          >
            <kbd className="text-xs px-1.5 py-0.5 bg-slate-700 rounded">Esc</kbd>
          </button>
        </div>

        {/* Filter Options */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-700/50 bg-slate-800/50">
          <span className="text-xs text-slate-500">Search in:</span>
          {['all', 'titles', 'content'].map(option => (
            <button
              key={option}
              onClick={() => setSearchIn(option)}
              className={`
                px-2 py-1 text-xs rounded transition-colors
                ${searchIn === option
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }
              `}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
          {results.length > 0 && (
            <span className="ml-auto text-xs text-slate-500">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query && results.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No matches found for "{query}"</p>
              <p className="text-xs mt-1">Try different keywords or search options</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result.id)}
                  className={`
                    w-full px-4 py-3 text-left transition-colors
                    ${index === selectedIndex
                      ? 'bg-teal-500/20 border-l-2 border-teal-500'
                      : 'hover:bg-slate-700/50 border-l-2 border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    {/* Node icon based on type */}
                    <span className="text-slate-400">
                      {result.children?.length > 0 ? '📁' : '📄'}
                    </span>
                    {/* Title with highlight */}
                    <span className="font-medium text-white">
                      <HighlightText text={result.title} query={query} />
                    </span>
                    {/* Match type badge */}
                    <span className={`
                      text-xs px-1.5 py-0.5 rounded
                      ${result.matchType === 'title'
                        ? 'bg-teal-500/20 text-teal-400'
                        : 'bg-orange-500/20 text-orange-400'
                      }
                    `}>
                      {result.matchType}
                    </span>
                    {/* Depth indicator */}
                    <span className="ml-auto text-xs text-slate-500">
                      Level {result.level + 1}
                    </span>
                  </div>
                  {/* Content snippet */}
                  {result.snippet && (
                    <p className="mt-1 text-sm text-slate-400 truncate pl-6">
                      <HighlightText text={result.snippet} query={query} />
                    </p>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>Type to search your prompt tree</p>
              <p className="text-xs mt-1">Search by title or content</p>
            </div>
          )}
        </div>

        {/* Footer with keyboard hints */}
        {results.length > 0 && (
          <div className="flex items-center gap-4 px-4 py-2 border-t border-slate-700 bg-slate-800/50 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">Enter</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">Esc</kbd>
              Close
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// Highlight matching text
function HighlightText({ text, query }) {
  if (!text || !query) return text

  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'))

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-teal-500/30 text-teal-300 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}

// Get snippet around matching text
function getSnippet(content, searchTerm, contextLength = 50) {
  if (!content) return null

  const lowerContent = content.toLowerCase()
  const index = lowerContent.indexOf(searchTerm.toLowerCase())

  if (index === -1) return null

  const start = Math.max(0, index - contextLength)
  const end = Math.min(content.length, index + searchTerm.length + contextLength)

  let snippet = content.slice(start, end)
  if (start > 0) snippet = '...' + snippet
  if (end < content.length) snippet = snippet + '...'

  return snippet
}

// Escape special regex characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
