import { useState, useEffect, useCallback } from 'react'
import { createTree, addNode, deleteNode, updateNode, createNode, moveNode, reorderChildren, findParent } from '../lib/tree-utils'

const STORAGE_KEY = 'prompt-factory-tree'

export function usePromptTree() {
  const [tree, setTree] = useState(null)
  const [selectedNodeId, setSelectedNodeId] = useState(null)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setTree(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load saved tree:', e)
      }
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (tree) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tree))
    }
  }, [tree])

  // Create a new tree
  const create = useCallback((title, description = '') => {
    const newTree = createTree(title, description)
    setTree(newTree)
    setSelectedNodeId(newTree.root_node.id)
    return newTree
  }, [])

  // Load tree from template or JSON
  const loadTree = useCallback((newTree) => {
    setTree(newTree)
    setSelectedNodeId(newTree.root_node.id)
  }, [])

  // Add a new node
  const add = useCallback((parentId, title, content = '', examples = []) => {
    if (!tree) return
    const node = createNode(title, content, examples)
    setTree(prev => ({ ...addNode(prev, parentId, node) }))
    return node.id
  }, [tree])

  // Delete a node
  const remove = useCallback((nodeId) => {
    if (!tree) return
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(tree.root_node.id)
    }
    setTree(prev => ({ ...deleteNode(prev, nodeId) }))
  }, [tree, selectedNodeId])

  // Update a node
  const update = useCallback((nodeId, updates) => {
    if (!tree) return
    setTree(prev => ({ ...updateNode(prev, nodeId, updates) }))
  }, [tree])

  // Update tree metadata
  const updateMetadata = useCallback((title, description) => {
    if (!tree) return
    setTree(prev => ({
      ...prev,
      title,
      description,
      metadata: {
        ...prev.metadata,
        updated_at: new Date().toISOString()
      }
    }))
  }, [tree])

  // Clear tree
  const clear = useCallback(() => {
    setTree(null)
    setSelectedNodeId(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // Move a node to a new parent
  const move = useCallback((nodeId, newParentId, newIndex = -1) => {
    if (!tree) return
    setTree(prev => {
      const updated = moveNode({ ...prev, root_node: JSON.parse(JSON.stringify(prev.root_node)) }, nodeId, newParentId, newIndex)
      return { ...updated }
    })
  }, [tree])

  // Reorder children within the same parent
  const reorder = useCallback((parentId, oldIndex, newIndex) => {
    if (!tree) return
    setTree(prev => {
      const updated = reorderChildren({ ...prev, root_node: JSON.parse(JSON.stringify(prev.root_node)) }, parentId, oldIndex, newIndex)
      return { ...updated }
    })
  }, [tree])

  // Get parent of a node
  const getParent = useCallback((nodeId) => {
    if (!tree) return null
    return findParent(tree.root_node, nodeId)
  }, [tree])

  return {
    tree,
    selectedNodeId,
    setSelectedNodeId,
    create,
    loadTree,
    add,
    remove,
    update,
    updateMetadata,
    clear,
    move,
    reorder,
    getParent
  }
}
