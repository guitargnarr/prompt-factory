import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { getAllNodes, findParent } from '../lib/tree-utils'

function SortableTreeNode({ node, selectedNodeId, onSelectNode, isDragging }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isThisDragging,
  } = useSortable({ id: node.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    paddingLeft: `${node.level * 20 + 12}px`,
    opacity: isThisDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg transition-colors min-h-[44px]
        cursor-grab active:cursor-grabbing
        ${selectedNodeId === node.id
          ? 'bg-teal-500/20 border border-teal-500/50 text-white'
          : 'hover:bg-slate-700/50 text-slate-300 hover:text-white border border-transparent'
        }
        ${isThisDragging ? 'shadow-lg shadow-teal-500/20' : ''}
      `}
      {...attributes}
      {...listeners}
    >
      <span className="text-sm flex-shrink-0 select-none">
        {node.children.length > 0 ? '📁' : '📄'}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onSelectNode(node.id)
        }}
        className="flex-1 text-left truncate focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
      >
        {node.title}
      </button>
      {node.content && (
        <span className="text-xs text-slate-500 truncate max-w-[100px] select-none">
          {node.content.slice(0, 20)}...
        </span>
      )}
      <span className="text-slate-600 flex-shrink-0 select-none" title="Drag to reorder">
        ⋮⋮
      </span>
    </div>
  )
}

function DragOverlayContent({ node }) {
  if (!node) return null

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border-2 border-teal-500 text-white shadow-xl min-h-[44px]"
      style={{ paddingLeft: `${node.level * 20 + 12}px` }}
    >
      <span className="text-sm">
        {node.children.length > 0 ? '📁' : '📄'}
      </span>
      <span className="flex-1 truncate">{node.title}</span>
    </div>
  )
}

export function DraggableTreeView({ tree, selectedNodeId, onSelectNode, onMove, onReorder, getParent }) {
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  if (!tree) return null

  const nodes = getAllNodes(tree.root_node)
  const activeNode = activeId ? nodes.find(n => n.id === activeId) : null

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) return

    // Can't move root node
    if (active.id === tree.root_node.id) return

    const activeNode = nodes.find(n => n.id === active.id)
    const overNode = nodes.find(n => n.id === over.id)

    if (!activeNode || !overNode) return

    // Find parents
    const activeParent = getParent(active.id)
    const overParent = getParent(over.id)

    if (!activeParent) return

    // Same parent - reorder
    if (activeParent.id === overParent?.id) {
      const oldIndex = activeParent.children.findIndex(c => c.id === active.id)
      const newIndex = activeParent.children.findIndex(c => c.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        onReorder(activeParent.id, oldIndex, newIndex)
      }
    } else {
      // Different parent - move to new parent
      // If dropping ON a folder, make it a child of that folder
      // If dropping ON a file, make it a sibling (same parent as target)
      if (overNode.children.length > 0) {
        // Dropping on a folder - add as first child
        onMove(active.id, over.id, 0)
      } else if (overParent) {
        // Dropping on a file - add as sibling after target
        const targetIndex = overParent.children.findIndex(c => c.id === over.id)
        onMove(active.id, overParent.id, targetIndex + 1)
      }
    }
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={nodes.map(n => n.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {nodes.map(node => (
            <SortableTreeNode
              key={node.id}
              node={node}
              selectedNodeId={selectedNodeId}
              onSelectNode={onSelectNode}
              isDragging={activeId === node.id}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        <DragOverlayContent node={activeNode} />
      </DragOverlay>
    </DndContext>
  )
}
