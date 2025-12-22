import { useState } from 'react'
import { Button } from './ui/Button'
import { Input, Textarea, Select } from './ui/Input'
import { getAllNodes } from '../lib/tree-utils'

export function NodeForm({ tree, onAdd }) {
  const [parentId, setParentId] = useState(tree?.root_node?.id || '')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  if (!tree) return null

  const nodes = getAllNodes(tree.root_node)
  const parentOptions = nodes.map(node => ({
    value: node.id,
    label: '  '.repeat(node.level) + node.title
  }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    onAdd(parentId, title, content)
    setTitle('')
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold text-white">Add Node</h3>

      <Select
        label="Parent Node"
        options={parentOptions}
        value={parentId}
        onChange={(e) => setParentId(e.target.value)}
      />

      <Input
        label="Node Title"
        placeholder="e.g., Introduction"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Textarea
        label="Content (optional)"
        placeholder="Node content or instructions..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
      />

      <Button type="submit" className="w-full">
        + Add Node
      </Button>
    </form>
  )
}

export function EditNodeForm({ node, onUpdate, onDelete }) {
  const [title, setTitle] = useState(node?.title || '')
  const [content, setContent] = useState(node?.content || '')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!node) return null

  const handleSave = () => {
    onUpdate(node.id, { title, content })
  }

  const isRoot = node.title === 'Root'

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-white">Edit Node</h3>

      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isRoot}
      />

      <Textarea
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
      />

      <div className="flex gap-2">
        <Button onClick={handleSave} className="flex-1">
          Save Changes
        </Button>
        {!isRoot && (
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-400 hover:text-red-300"
          >
            Delete
          </Button>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-sm text-red-300 mb-3">
            Delete "{node.title}" and all its children?
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => onDelete(node.id)}
              className="flex-1 border-red-500/50 text-red-400"
            >
              Yes, Delete
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
