import { useState, useEffect, useRef, useCallback } from 'react'
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

function SortableTreeNode({
  node,
  selectedNodeId,
  onSelectNode,
  isDragging,
  isExpanded,
  onToggleExpand,
  nodeRef
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isThisDragging,
  } = useSortable({ id: node.id })

  const isSelected = selectedNodeId === node.id
  const hasChildren = node.children.length > 0

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    paddingLeft: `${node.level * 20 + 12}px`,
    opacity: isThisDragging ? 0.5 : 1,
  }

  // Combine refs
  const combinedRef = (el) => {
    setNodeRef(el)
    if (nodeRef) nodeRef.current = el
  }

  return (
    <div
      ref={combinedRef}
      style={style}
      data-node-id={node.id}
      tabIndex={isSelected ? 0 : -1}
      role="treeitem"
      aria-selected={isSelected}
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-level={node.level + 1}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg transition-colors min-h-[44px]
        cursor-grab active:cursor-grabbing outline-none
        ${isSelected
          ? 'bg-teal-500/20 border border-teal-500/50 text-white ring-2 ring-teal-400 ring-offset-1 ring-offset-slate-900'
          : 'hover:bg-slate-700/50 text-slate-300 hover:text-white border border-transparent'
        }
        ${isThisDragging ? 'shadow-lg shadow-teal-500/20' : ''}
      `}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation()
        onSelectNode(node.id)
      }}
    >
      {/* Expand/Collapse indicator */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          if (hasChildren) onToggleExpand(node.id)
        }}
        className={`w-4 h-4 flex items-center justify-center text-xs flex-shrink-0 ${
          hasChildren ? 'text-slate-400 hover:text-white' : 'text-transparent'
        }`}
        tabIndex={-1}
        aria-hidden="true"
      >
        {hasChildren ? (isExpanded ? '▼' : '▶') : ''}
      </button>

      <span className="text-sm flex-shrink-0 select-none">
        {hasChildren ? '📁' : '📄'}
      </span>

      <span className="flex-1 truncate">{node.title}</span>

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

// Keyboard shortcuts help component
function KeyboardShortcutsHelp({ show }) {
  if (!show) return null

  return (
    <div className="absolute bottom-full left-0 mb-2 p-3 bg-slate-800 border border-slate-700 rounded-lg shadow-xl text-xs z-50 min-w-[200px]">
      <div className="font-semibold text-white mb-2">Keyboard Shortcuts</div>
      <div className="space-y-1 text-slate-300">
        <div className="flex justify-between gap-4">
          <span>↑ / ↓</span>
          <span className="text-slate-500">Navigate nodes</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>← / →</span>
          <span className="text-slate-500">Collapse / Expand</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Enter</span>
          <span className="text-slate-500">Edit node</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Delete</span>
          <span className="text-slate-500">Delete node</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Home / End</span>
          <span className="text-slate-500">First / Last node</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>N</span>
          <span className="text-slate-500">Add child node</span>
        </div>
      </div>
    </div>
  )
}

export function DraggableTreeView({
  tree,
  selectedNodeId,
  onSelectNode,
  onMove,
  onReorder,
  getParent,
  onDelete,
  onRequestEdit,
  onRequestAddChild
}) {
  const [activeId, setActiveId] = useState(null)
  const [expandedNodes, setExpandedNodes] = useState(new Set())
  const [showShortcuts, setShowShortcuts] = useState(false)
  const containerRef = useRef(null)
  const selectedNodeRef = useRef(null)

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

  // Initialize all folders as expanded
  useEffect(() => {
    if (tree) {
      const allNodes = getAllNodes(tree.root_node)
      const foldersWithChildren = allNodes
        .filter(n => n.children.length > 0)
        .map(n => n.id)
      setExpandedNodes(new Set(foldersWithChildren))
    }
  }, [tree?.id])

  // Get visible nodes (respecting collapsed state)
  const getVisibleNodes = useCallback(() => {
    if (!tree) return []

    const result = []
    const traverse = (node, level = 0) => {
      result.push({ ...node, level })
      if (node.children.length > 0 && expandedNodes.has(node.id)) {
        node.children.forEach(child => traverse(child, level + 1))
      }
    }
    traverse(tree.root_node)
    return result
  }, [tree, expandedNodes])

  const visibleNodes = getVisibleNodes()

  // Toggle expand/collapse
  const toggleExpand = useCallback((nodeId) => {
    setExpandedNodes(prev => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }, [])

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e) => {
    if (!selectedNodeId || visibleNodes.length === 0) return

    const currentIndex = visibleNodes.findIndex(n => n.id === selectedNodeId)
    if (currentIndex === -1) return

    const currentNode = visibleNodes[currentIndex]

    switch (e.key) {
      case 'ArrowUp': {
        e.preventDefault()
        if (currentIndex > 0) {
          onSelectNode(visibleNodes[currentIndex - 1].id)
        }
        break
      }

      case 'ArrowDown': {
        e.preventDefault()
        if (currentIndex < visibleNodes.length - 1) {
          onSelectNode(visibleNodes[currentIndex + 1].id)
        }
        break
      }

      case 'ArrowLeft': {
        e.preventDefault()
        if (currentNode.children.length > 0 && expandedNodes.has(currentNode.id)) {
          // Collapse if expanded
          toggleExpand(currentNode.id)
        } else {
          // Move to parent if collapsed or no children
          const parent = getParent(currentNode.id)
          if (parent) {
            onSelectNode(parent.id)
          }
        }
        break
      }

      case 'ArrowRight': {
        e.preventDefault()
        if (currentNode.children.length > 0) {
          if (!expandedNodes.has(currentNode.id)) {
            // Expand if collapsed
            toggleExpand(currentNode.id)
          } else if (currentNode.children.length > 0) {
            // Move to first child if expanded
            onSelectNode(currentNode.children[0].id)
          }
        }
        break
      }

      case 'Home': {
        e.preventDefault()
        if (visibleNodes.length > 0) {
          onSelectNode(visibleNodes[0].id)
        }
        break
      }

      case 'End': {
        e.preventDefault()
        if (visibleNodes.length > 0) {
          onSelectNode(visibleNodes[visibleNodes.length - 1].id)
        }
        break
      }

      case 'Enter': {
        e.preventDefault()
        if (onRequestEdit) {
          onRequestEdit(currentNode.id)
        }
        break
      }

      case 'Delete':
      case 'Backspace': {
        // Only handle Delete, not Backspace (which might be used in inputs)
        if (e.key === 'Delete' && onDelete && currentNode.id !== tree.root_node.id) {
          e.preventDefault()
          if (confirm(`Delete "${currentNode.title}" and all its children?`)) {
            // Select previous or next node before deleting
            const newIndex = currentIndex > 0 ? currentIndex - 1 : (currentIndex < visibleNodes.length - 1 ? currentIndex + 1 : 0)
            const newSelectedId = visibleNodes[newIndex]?.id || tree.root_node.id
            onDelete(currentNode.id)
            onSelectNode(newSelectedId)
          }
        }
        break
      }

      case 'n':
      case 'N': {
        // Add child node (only if not in an input)
        if (!e.target.matches('input, textarea') && onRequestAddChild) {
          e.preventDefault()
          onRequestAddChild(currentNode.id)
        }
        break
      }

      case '*': {
        // Expand all
        e.preventDefault()
        const allNodes = getAllNodes(tree.root_node)
        const allFolders = allNodes.filter(n => n.children.length > 0).map(n => n.id)
        setExpandedNodes(new Set(allFolders))
        break
      }

      case '?': {
        // Toggle shortcuts help
        e.preventDefault()
        setShowShortcuts(prev => !prev)
        break
      }

      case 'Escape': {
        setShowShortcuts(false)
        break
      }

      default:
        break
    }
  }, [selectedNodeId, visibleNodes, expandedNodes, toggleExpand, onSelectNode, getParent, onDelete, onRequestEdit, onRequestAddChild, tree])

  // Focus selected node when selection changes
  useEffect(() => {
    if (selectedNodeId && containerRef.current) {
      const nodeEl = containerRef.current.querySelector(`[data-node-id="${selectedNodeId}"]`)
      if (nodeEl) {
        nodeEl.focus()
      }
    }
  }, [selectedNodeId])

  if (!tree) return null

  const allNodes = getAllNodes(tree.root_node)
  const activeNode = activeId ? allNodes.find(n => n.id === activeId) : null

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) return
    if (active.id === tree.root_node.id) return

    const activeNode = allNodes.find(n => n.id === active.id)
    const overNode = allNodes.find(n => n.id === over.id)

    if (!activeNode || !overNode) return

    const activeParent = getParent(active.id)
    const overParent = getParent(over.id)

    if (!activeParent) return

    if (activeParent.id === overParent?.id) {
      const oldIndex = activeParent.children.findIndex(c => c.id === active.id)
      const newIndex = activeParent.children.findIndex(c => c.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        onReorder(activeParent.id, oldIndex, newIndex)
      }
    } else {
      if (overNode.children.length > 0) {
        onMove(active.id, over.id, 0)
      } else if (overParent) {
        const targetIndex = overParent.children.findIndex(c => c.id === over.id)
        onMove(active.id, overParent.id, targetIndex + 1)
      }
    }
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  return (
    <div className="relative">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={visibleNodes.map(n => n.id)} strategy={verticalListSortingStrategy}>
          <div
            ref={containerRef}
            className="space-y-1"
            role="tree"
            aria-label="Prompt tree"
            onKeyDown={handleKeyDown}
          >
            {visibleNodes.map(node => (
              <SortableTreeNode
                key={node.id}
                node={node}
                selectedNodeId={selectedNodeId}
                onSelectNode={onSelectNode}
                isDragging={activeId === node.id}
                isExpanded={expandedNodes.has(node.id)}
                onToggleExpand={toggleExpand}
                nodeRef={node.id === selectedNodeId ? selectedNodeRef : null}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          <DragOverlayContent node={activeNode} />
        </DragOverlay>
      </DndContext>

      {/* Keyboard shortcuts indicator */}
      <div className="relative mt-3 flex items-center justify-between text-xs text-slate-500">
        <button
          onClick={() => setShowShortcuts(prev => !prev)}
          className="flex items-center gap-1 hover:text-slate-300 transition-colors"
        >
          <span>⌨️</span>
          <span>Keyboard shortcuts</span>
          <span className="text-slate-600">(press ?)</span>
        </button>
        <KeyboardShortcutsHelp show={showShortcuts} />
      </div>
    </div>
  )
}
