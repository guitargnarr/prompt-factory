import { useState, useRef, useEffect } from 'react'
import { Card } from './ui/Card'
import { Input, Textarea } from './ui/Input'
import { Button } from './ui/Button'
import { DraggableTreeView } from './DraggableTreeView'
import { NodeForm, EditNodeForm } from './NodeForm'
import { VersionHistory } from './VersionHistory'
import { findNode } from '../lib/tree-utils'

export function TreeBuilder({
  tree,
  selectedNodeId,
  onSelectNode,
  onAdd,
  onUpdate,
  onDelete,
  onUpdateMetadata,
  onClear,
  onMove,
  onReorder,
  getParent,
  // Version control props
  versions,
  onSaveVersion,
  onRestoreVersion,
  onDeleteVersion,
  onRenameVersion
}) {
  const [showSettings, setShowSettings] = useState(false)
  const [editTitle, setEditTitle] = useState(tree?.title || '')
  const [focusEditForm, setFocusEditForm] = useState(false)
  const [addChildParentId, setAddChildParentId] = useState(null)
  const editFormRef = useRef(null)
  const addFormRef = useRef(null)

  // Focus edit form when requested via keyboard
  useEffect(() => {
    if (focusEditForm && editFormRef.current) {
      const input = editFormRef.current.querySelector('input')
      if (input) input.focus()
      setFocusEditForm(false)
    }
  }, [focusEditForm])

  // Focus add form when requested via keyboard
  useEffect(() => {
    if (addChildParentId && addFormRef.current) {
      const input = addFormRef.current.querySelector('input')
      if (input) input.focus()
    }
  }, [addChildParentId])

  // Handle keyboard request to edit
  const handleRequestEdit = (nodeId) => {
    onSelectNode(nodeId)
    setFocusEditForm(true)
  }

  // Handle keyboard request to add child
  const handleRequestAddChild = (parentId) => {
    setAddChildParentId(parentId)
  }

  const [editDescription, setEditDescription] = useState(tree?.description || '')

  if (!tree) return null

  const selectedNode = findNode(tree.root_node, selectedNodeId)

  const handleSaveSettings = () => {
    onUpdateMetadata(editTitle, editDescription)
    setShowSettings(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Tree Structure */}
      <div className="space-y-4">
        {/* Tree Header */}
        <Card>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-xl font-semibold text-white">{tree.title}</h2>
              {tree.description && (
                <p className="text-sm text-slate-400 mt-1">{tree.description}</p>
              )}
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                setEditTitle(tree.title)
                setEditDescription(tree.description)
                setShowSettings(!showSettings)
              }}
              className="text-slate-400"
            >
              ⚙️
            </Button>
          </div>

          {showSettings && (
            <div className="border-t border-slate-700 pt-4 mt-4 space-y-3">
              <Input
                label="Tree Title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <Textarea
                label="Description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={2}
              />
              <div className="flex gap-2">
                <Button onClick={handleSaveSettings} className="flex-1">
                  Save
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowSettings(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Tree View */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Tree Structure</h3>
            <span className="text-xs text-slate-500">Drag or use keyboard</span>
          </div>
          <DraggableTreeView
            tree={tree}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            onMove={onMove}
            onReorder={onReorder}
            getParent={getParent}
            onDelete={onDelete}
            onRequestEdit={handleRequestEdit}
            onRequestAddChild={handleRequestAddChild}
          />
        </Card>

        {/* Clear Button */}
        <Button
          variant="secondary"
          onClick={() => {
            if (confirm('Clear this tree and start over?')) {
              onClear()
            }
          }}
          className="w-full text-slate-400"
        >
          🗑️ Clear Tree
        </Button>
      </div>

      {/* Right Column - Forms */}
      <div className="space-y-4">
        {/* Add Node Form */}
        <Card>
          <div ref={addFormRef}>
            <NodeForm
              tree={tree}
              onAdd={onAdd}
              defaultParentId={addChildParentId || selectedNodeId}
              onAdded={() => setAddChildParentId(null)}
            />
          </div>
        </Card>

        {/* Edit Selected Node */}
        {selectedNode && (
          <Card>
            <div ref={editFormRef}>
              <EditNodeForm
                key={selectedNodeId}
                node={selectedNode}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            </div>
          </Card>
        )}

        {/* Version History */}
        {versions && (
          <Card>
            <VersionHistory
              versions={versions}
              onSaveVersion={onSaveVersion}
              onRestoreVersion={onRestoreVersion}
              onDeleteVersion={onDeleteVersion}
              onRenameVersion={onRenameVersion}
              currentTree={tree}
            />
          </Card>
        )}
      </div>
    </div>
  )
}
