import { useState } from 'react'
import { Button } from './ui/Button'
import { TEMPLATE_CATEGORIES, TEMPLATES, getTemplate } from '../lib/templates'
import { countNodes, getTreeDepth } from '../lib/tree-utils'

export function Sidebar({ tree, onLoadTemplate, onImport }) {
  const [expandedCategories, setExpandedCategories] = useState(['General'])

  const toggleCategory = (category) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result
        onImport(content)
      } catch (error) {
        alert('Failed to read file')
      }
    }
    reader.readAsText(file)
    e.target.value = '' // Reset input
  }

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏭</span>
          <div>
            <h1 className="font-bold text-white">Prompt Factory</h1>
            <p className="text-xs text-slate-400">Build AI Prompts</p>
          </div>
        </div>
      </div>

      {/* Stats (if tree exists) */}
      {tree && (
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Current Tree
          </h3>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-slate-900 rounded-lg p-2">
              <div className="text-lg font-bold text-teal-400">
                {countNodes(tree.root_node)}
              </div>
              <div className="text-xs text-slate-400">Nodes</div>
            </div>
            <div className="bg-slate-900 rounded-lg p-2">
              <div className="text-lg font-bold text-orange-400">
                {getTreeDepth(tree.root_node)}
              </div>
              <div className="text-xs text-slate-400">Depth</div>
            </div>
          </div>
        </div>
      )}

      {/* Templates */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Quick Start Templates
        </h3>

        {Object.entries(TEMPLATE_CATEGORIES).map(([category, templateNames]) => (
          <div key={category} className="mb-2">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded transition-colors min-h-[36px]"
            >
              <span>{expandedCategories.includes(category) ? '▾' : '▸'} {category}</span>
            </button>

            {expandedCategories.includes(category) && (
              <div className="ml-2 mt-1 space-y-1">
                {templateNames.map(name => {
                  const template = TEMPLATES[name]
                  return (
                    <button
                      key={name}
                      onClick={() => onLoadTemplate(getTemplate(name))}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-teal-500/20 rounded transition-colors text-left min-h-[36px]"
                    >
                      <span>{template.icon}</span>
                      <span className="truncate">{name}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Import */}
      <div className="p-4 border-t border-slate-700">
        <label className="block">
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button variant="secondary" className="w-full cursor-pointer">
            📁 Import JSON
          </Button>
        </label>
      </div>
    </aside>
  )
}
