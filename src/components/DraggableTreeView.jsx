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

// Swipe gesture constants
const SWIPE_THRESHOLD = 60
const DELETE_SWIPE_THRESHOLD = 100

function SwipeableTreeNode({
  node,
  selectedNodeId,
  onSelectNode,
  isDragging,
  isExpanded,
  onToggleExpand,
  nodeRef,
  onSwipeLeft,
  onSwipeRight,
  onSwipeDelete,
  isRoot,
  isHighlighted
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isThisDragging,
  } = useSortable({ id: node.id })

  const [swipeState, setSwipeState] = useState({
    swiping: false,
    deltaX: 0,
    startX: 0,
    startY: 0
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const isSelected = selectedNodeId === node.id
  const hasChildren = node.children.length > 0

  // Handle touch events for swipe
  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    setSwipeState({
      swiping: true,
      deltaX: 0,
      startX: touch.clientX,
      startY: touch.clientY
    })
    setShowDeleteConfirm(false)
  }

  const handleTouchMove = (e) => {
    if (!swipeState.swiping) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - swipeState.startX
    const deltaY = touch.clientY - swipeState.startY

    // Only allow horizontal swipes (prevent vertical scroll interference)
    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      e.preventDefault()
      setSwipeState(prev => ({ ...prev, deltaX }))
    }
  }

  const handleTouchEnd = () => {
    const { deltaX } = swipeState

    if (Math.abs(deltaX) > DELETE_SWIPE_THRESHOLD && deltaX < 0 && !isRoot) {
      // Strong swipe left - show delete confirmation
      setShowDeleteConfirm(true)
    } else if (deltaX < -SWIPE_THRESHOLD) {
      // Swipe left - collapse or go to parent
      onSwipeLeft?.()
    } else if (deltaX > SWIPE_THRESHOLD) {
      // Swipe right - expand or go to first child
      onSwipeRight?.()
    }

    setSwipeState({ swiping: false, deltaX: 0, startX: 0, startY: 0 })
  }

  const handleTouchCancel = () => {
    setSwipeState({ swiping: false, deltaX: 0, startX: 0, startY: 0 })
    setShowDeleteConfirm(false)
  }

  // Combine refs
  const combinedRef = (el) => {
    setNodeRef(el)
    if (nodeRef) nodeRef.current = el
  }

  // Calculate swipe visual feedback
  const swipeTransform = swipeState.swiping ? `translateX(${swipeState.deltaX * 0.5}px)` : ''
  const swipeOpacity = swipeState.swiping && swipeState.deltaX < -DELETE_SWIPE_THRESHOLD ? 0.6 : 1

  // Background indicator for swipe direction
  const getSwipeIndicator = () => {
    if (!swipeState.swiping || Math.abs(swipeState.deltaX) < 20) return null

    if (swipeState.deltaX < -DELETE_SWIPE_THRESHOLD && !isRoot) {
      return (
        <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-end pr-4 pointer-events-none">
          <span className="text-red-400 text-sm font-medium">Delete</span>
        </div>
      )
    } else if (swipeState.deltaX < -SWIPE_THRESHOLD) {
      return (
        <div className="absolute inset-0 bg-orange-500/10 rounded-lg flex items-center justify-end pr-4 pointer-events-none">
          <span className="text-orange-400 text-sm">← Collapse</span>
        </div>
      )
    } else if (swipeState.deltaX > SWIPE_THRESHOLD) {
      return (
        <div className="absolute inset-0 bg-teal-500/10 rounded-lg flex items-center justify-start pl-4 pointer-events-none">
          <span className="text-teal-400 text-sm">Expand →</span>
        </div>
      )
    }
    return null
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    paddingLeft: `${node.level * 20 + 12}px`,
    opacity: isThisDragging ? 0.5 : swipeOpacity,
  }

  return (
    <div className="relative">
      {getSwipeIndicator()}

      {/* Delete confirmation overlay */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-slate-900/95 rounded-lg flex items-center justify-between px-3 z-10">
          <span className="text-sm text-red-400">Delete "{node.title}"?</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onSwipeDelete?.()
                setShowDeleteConfirm(false)
              }}
              className="px-3 py-1 bg-red-500/20 border border-red-500/50 text-red-400 rounded text-sm hover:bg-red-500/30 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-sm hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div
        ref={combinedRef}
        style={{
          ...style,
          transform: `${style.transform || ''} ${swipeTransform}`.trim() || undefined
        }}
        data-node-id={node.id}
        tabIndex={isSelected ? 0 : -1}
        role="treeitem"
        aria-selected={isSelected}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-level={node.level + 1}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg transition-colors min-h-[44px]
          cursor-grab active:cursor-grabbing outline-none touch-pan-y
          ${isSelected
            ? 'bg-teal-500/20 border border-teal-500/50 text-white ring-2 ring-teal-400 ring-offset-1 ring-offset-slate-900'
            : isHighlighted
              ? 'bg-orange-500/20 border border-orange-500/50 text-white'
              : 'hover:bg-slate-700/50 text-slate-300 hover:text-white border border-transparent'
          }
          ${isThisDragging ? 'shadow-lg shadow-teal-500/20' : ''}
          ${swipeState.swiping ? 'transition-none' : 'transition-transform'}
        `}
        {...attributes}
        {...listeners}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        onClick={(e) => {
          e.stopPropagation()
          if (!swipeState.swiping) {
            onSelectNode(node.id)
          }
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
          <span className="text-xs text-slate-500 truncate max-w-[100px] select-none hidden sm:inline">
            {node.content.slice(0, 20)}...
          </span>
        )}

        <span className="text-slate-600 flex-shrink-0 select-none hidden sm:inline" title="Drag to reorder">
          ⋮⋮
        </span>
      </div>
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

// Help component for both keyboard and touch
function NavigationHelp({ show, isMobile }) {
  if (!show) return null

  return (
    <div className="absolute bottom-full left-0 mb-2 p-3 bg-slate-800 border border-slate-700 rounded-lg shadow-xl text-xs z-50 min-w-[220px]">
      {isMobile ? (
        <>
          <div className="font-semibold text-white mb-2">Touch Gestures</div>
          <div className="space-y-1 text-slate-300">
            <div className="flex justify-between gap-4">
              <span>Swipe →</span>
              <span className="text-slate-500">Expand folder</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Swipe ←</span>
              <span className="text-slate-500">Collapse / Parent</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Long swipe ←</span>
              <span className="text-slate-500">Delete node</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Tap</span>
              <span className="text-slate-500">Select node</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Hold + Drag</span>
              <span className="text-slate-500">Reorder</span>
            </div>
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
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
  onRequestAddChild,
  highlightedNodeIds = []
}) {
  const [activeId, setActiveId] = useState(null)
  const [expandedNodes, setExpandedNodes] = useState(new Set())
  const [showHelp, setShowHelp] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef(null)
  const selectedNodeRef = useRef(null)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        delay: isMobile ? 200 : 0, // Longer delay on mobile to allow swipes
        tolerance: 5
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

  // Handle swipe left - collapse or go to parent
  const handleSwipeLeft = useCallback((nodeId) => {
    const node = visibleNodes.find(n => n.id === nodeId)
    if (!node) return

    if (node.children.length > 0 && expandedNodes.has(nodeId)) {
      // Collapse if expanded
      toggleExpand(nodeId)
    } else {
      // Move to parent
      const parent = getParent(nodeId)
      if (parent) {
        onSelectNode(parent.id)
      }
    }
  }, [visibleNodes, expandedNodes, toggleExpand, getParent, onSelectNode])

  // Handle swipe right - expand or go to first child
  const handleSwipeRight = useCallback((nodeId) => {
    const node = visibleNodes.find(n => n.id === nodeId)
    if (!node) return

    if (node.children.length > 0) {
      if (!expandedNodes.has(nodeId)) {
        // Expand if collapsed
        toggleExpand(nodeId)
      } else {
        // Move to first child
        onSelectNode(node.children[0].id)
      }
    }
  }, [visibleNodes, expandedNodes, toggleExpand, onSelectNode])

  // Handle swipe delete
  const handleSwipeDelete = useCallback((nodeId) => {
    if (onDelete && nodeId !== tree?.root_node.id) {
      const currentIndex = visibleNodes.findIndex(n => n.id === nodeId)
      const newIndex = currentIndex > 0 ? currentIndex - 1 : (currentIndex < visibleNodes.length - 1 ? currentIndex + 1 : 0)
      const newSelectedId = visibleNodes[newIndex]?.id || tree.root_node.id
      onDelete(nodeId)
      onSelectNode(newSelectedId)
    }
  }, [onDelete, tree, visibleNodes, onSelectNode])

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
        handleSwipeLeft(currentNode.id)
        break
      }

      case 'ArrowRight': {
        e.preventDefault()
        handleSwipeRight(currentNode.id)
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
        if (e.key === 'Delete' && onDelete && currentNode.id !== tree.root_node.id) {
          e.preventDefault()
          if (confirm(`Delete "${currentNode.title}" and all its children?`)) {
            handleSwipeDelete(currentNode.id)
          }
        }
        break
      }

      case 'n':
      case 'N': {
        if (!e.target.matches('input, textarea') && onRequestAddChild) {
          e.preventDefault()
          onRequestAddChild(currentNode.id)
        }
        break
      }

      case '*': {
        e.preventDefault()
        const allNodes = getAllNodes(tree.root_node)
        const allFolders = allNodes.filter(n => n.children.length > 0).map(n => n.id)
        setExpandedNodes(new Set(allFolders))
        break
      }

      case '?': {
        e.preventDefault()
        setShowHelp(prev => !prev)
        break
      }

      case 'Escape': {
        setShowHelp(false)
        break
      }

      default:
        break
    }
  }, [selectedNodeId, visibleNodes, handleSwipeLeft, handleSwipeRight, handleSwipeDelete, onSelectNode, onDelete, onRequestEdit, onRequestAddChild, tree])

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
              <SwipeableTreeNode
                key={node.id}
                node={node}
                selectedNodeId={selectedNodeId}
                onSelectNode={onSelectNode}
                isDragging={activeId === node.id}
                isExpanded={expandedNodes.has(node.id)}
                onToggleExpand={toggleExpand}
                nodeRef={node.id === selectedNodeId ? selectedNodeRef : null}
                onSwipeLeft={() => handleSwipeLeft(node.id)}
                onSwipeRight={() => handleSwipeRight(node.id)}
                onSwipeDelete={() => handleSwipeDelete(node.id)}
                isRoot={node.id === tree.root_node.id}
                isHighlighted={highlightedNodeIds.includes(node.id)}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          <DragOverlayContent node={activeNode} />
        </DragOverlay>
      </DndContext>

      {/* Navigation help indicator */}
      <div className="relative mt-3 flex items-center justify-between text-xs text-slate-500">
        <button
          onClick={() => setShowHelp(prev => !prev)}
          className="flex items-center gap-1 hover:text-slate-300 transition-colors"
        >
          {isMobile ? (
            <>
              <span>👆</span>
              <span>Swipe gestures</span>
            </>
          ) : (
            <>
              <span>⌨️</span>
              <span>Keyboard shortcuts</span>
              <span className="text-slate-600">(press ?)</span>
            </>
          )}
        </button>
        <NavigationHelp show={showHelp} isMobile={isMobile} />
      </div>
    </div>
  )
}
