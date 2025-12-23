import { useState } from 'react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

export function VersionHistory({
  versions,
  onSaveVersion,
  onRestoreVersion,
  onDeleteVersion,
  onRenameVersion,
  currentTree
}) {
  const [showAll, setShowAll] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editLabel, setEditLabel] = useState('')
  const [saveLabel, setSaveLabel] = useState('')
  const [confirmRestore, setConfirmRestore] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const displayVersions = showAll ? versions : versions.slice(0, 5)

  const handleSave = () => {
    onSaveVersion(saveLabel || undefined)
    setSaveLabel('')
  }

  const handleStartEdit = (version) => {
    setEditingId(version.id)
    setEditLabel(version.label)
  }

  const handleSaveEdit = (versionId) => {
    onRenameVersion(versionId, editLabel)
    setEditingId(null)
    setEditLabel('')
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Version History
        </h3>
        <span className="text-xs text-slate-500">{versions.length} saved</span>
      </div>

      {/* Save new version */}
      <div className="flex gap-2">
        <Input
          placeholder="Version label (optional)"
          value={saveLabel}
          onChange={(e) => setSaveLabel(e.target.value)}
          className="flex-1 text-sm"
        />
        <Button onClick={handleSave} className="whitespace-nowrap">
          Save Version
        </Button>
      </div>

      {/* Version list */}
      {versions.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-sm">
          <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          No versions saved yet
          <p className="text-xs mt-1">Save your first version to start tracking changes</p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayVersions.map((version, index) => (
            <div
              key={version.id}
              className={`
                p-3 rounded-lg border transition-colors
                ${index === 0
                  ? 'bg-teal-500/10 border-teal-500/30'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }
              `}
            >
              {/* Version header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {editingId === version.id ? (
                    <div className="flex gap-2">
                      <Input
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        className="text-sm py-1"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(version.id)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                      />
                      <Button
                        variant="ghost"
                        onClick={() => handleSaveEdit(version.id)}
                        className="px-2 py-1 text-xs"
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="font-medium text-white truncate cursor-pointer hover:text-teal-400 transition-colors"
                      onClick={() => handleStartEdit(version)}
                      title="Click to rename"
                    >
                      {version.label}
                      {index === 0 && (
                        <span className="ml-2 text-xs bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded">
                          Latest
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>{formatTimestamp(version.timestamp)}</span>
                    <span>{version.nodeCount} nodes</span>
                    {version.treeTitle && (
                      <span className="truncate">{version.treeTitle}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {confirmRestore === version.id ? (
                    <div className="flex items-center gap-1 bg-slate-900 rounded px-2 py-1">
                      <span className="text-xs text-slate-400 mr-1">Restore?</span>
                      <button
                        onClick={() => {
                          onRestoreVersion(version.id)
                          setConfirmRestore(null)
                        }}
                        className="text-xs px-2 py-0.5 bg-teal-500/20 text-teal-400 rounded hover:bg-teal-500/30 transition-colors"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmRestore(null)}
                        className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors"
                      >
                        No
                      </button>
                    </div>
                  ) : confirmDelete === version.id ? (
                    <div className="flex items-center gap-1 bg-slate-900 rounded px-2 py-1">
                      <span className="text-xs text-slate-400 mr-1">Delete?</span>
                      <button
                        onClick={() => {
                          onDeleteVersion(version.id)
                          setConfirmDelete(null)
                        }}
                        className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setConfirmRestore(version.id)}
                        className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-slate-700 rounded transition-colors"
                        title="Restore this version"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setConfirmDelete(version.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-colors"
                        title="Delete this version"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Show more/less */}
          {versions.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              {showAll ? 'Show less' : `Show ${versions.length - 5} more versions`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Compact version indicator for header
export function VersionIndicator({ versionCount, lastSaved, onOpenHistory }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Never'
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <button
      onClick={onOpenHistory}
      className="flex items-center gap-2 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
      title="View version history"
    >
      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-slate-400">
        {versionCount} versions
      </span>
      {lastSaved && (
        <span className="text-slate-500">
          Saved {formatTime(lastSaved)}
        </span>
      )}
    </button>
  )
}
