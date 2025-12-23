import { v4 as uuidv4 } from 'uuid'

// Generate short ID
export function generateId() {
  return uuidv4().slice(0, 8)
}

// Create a new empty tree
export function createTree(title, description = '') {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    title,
    description,
    version: '1.0.0',
    metadata: {
      created_at: now,
      updated_at: now,
      tags: []
    },
    root_node: {
      id: generateId(),
      title: 'Root',
      content: '',
      examples: [],
      children: []
    }
  }
}

// Create a new node
export function createNode(title, content = '', examples = []) {
  return {
    id: generateId(),
    title,
    content,
    examples,
    children: []
  }
}

// Find a node by ID (recursive)
export function findNode(node, nodeId) {
  if (node.id === nodeId) return node
  for (const child of node.children) {
    const found = findNode(child, nodeId)
    if (found) return found
  }
  return null
}

// Find parent of a node
export function findParent(node, nodeId, parent = null) {
  if (node.id === nodeId) return parent
  for (const child of node.children) {
    const found = findParent(child, nodeId, node)
    if (found) return found
  }
  return null
}

// Add a child node to a parent
export function addNode(tree, parentId, newNode) {
  const parent = findNode(tree.root_node, parentId)
  if (parent) {
    parent.children.push(newNode)
    tree.metadata.updated_at = new Date().toISOString()
  }
  return tree
}

// Delete a node and all its children
export function deleteNode(tree, nodeId) {
  // Can't delete root
  if (tree.root_node.id === nodeId) return tree

  function removeFromChildren(node) {
    node.children = node.children.filter(child => child.id !== nodeId)
    node.children.forEach(child => removeFromChildren(child))
  }

  removeFromChildren(tree.root_node)
  tree.metadata.updated_at = new Date().toISOString()
  return tree
}

// Update a node's properties
export function updateNode(tree, nodeId, updates) {
  const node = findNode(tree.root_node, nodeId)
  if (node) {
    Object.assign(node, updates)
    tree.metadata.updated_at = new Date().toISOString()
  }
  return tree
}

// Get tree depth
export function getTreeDepth(node, currentDepth = 0) {
  if (!node.children || node.children.length === 0) {
    return currentDepth
  }
  return Math.max(...node.children.map(child => getTreeDepth(child, currentDepth + 1)))
}

// Count all nodes
export function countNodes(node) {
  let count = 1
  for (const child of node.children) {
    count += countNodes(child)
  }
  return count
}

// Count nodes with content
export function countNodesWithContent(node) {
  let count = node.content && node.content.trim() ? 1 : 0
  for (const child of node.children) {
    count += countNodesWithContent(child)
  }
  return count
}

// Get all nodes as flat array
export function getAllNodes(node, level = 0) {
  const nodes = [{ ...node, level }]
  for (const child of node.children) {
    nodes.push(...getAllNodes(child, level + 1))
  }
  return nodes
}

// Move a node to a new parent or reorder within same parent
export function moveNode(tree, nodeId, newParentId, newIndex = -1) {
  // Can't move root
  if (tree.root_node.id === nodeId) return tree

  // Find the node to move
  const nodeToMove = findNode(tree.root_node, nodeId)
  if (!nodeToMove) return tree

  // Find current parent and remove node from it
  const currentParent = findParent(tree.root_node, nodeId)
  if (!currentParent) return tree

  // Remove from current parent
  const nodeIndex = currentParent.children.findIndex(c => c.id === nodeId)
  if (nodeIndex === -1) return tree
  currentParent.children.splice(nodeIndex, 1)

  // Find new parent
  const newParent = findNode(tree.root_node, newParentId)
  if (!newParent) {
    // Restore if new parent not found
    currentParent.children.splice(nodeIndex, 0, nodeToMove)
    return tree
  }

  // Prevent moving a node into its own descendants
  if (findNode(nodeToMove, newParentId)) {
    currentParent.children.splice(nodeIndex, 0, nodeToMove)
    return tree
  }

  // Add to new parent at specified index
  if (newIndex === -1 || newIndex >= newParent.children.length) {
    newParent.children.push(nodeToMove)
  } else {
    newParent.children.splice(newIndex, 0, nodeToMove)
  }

  tree.metadata.updated_at = new Date().toISOString()
  return tree
}

// Reorder children within the same parent
export function reorderChildren(tree, parentId, oldIndex, newIndex) {
  const parent = findNode(tree.root_node, parentId)
  if (!parent || !parent.children[oldIndex]) return tree

  const [movedChild] = parent.children.splice(oldIndex, 1)
  parent.children.splice(newIndex, 0, movedChild)

  tree.metadata.updated_at = new Date().toISOString()
  return tree
}

// Generate ASCII tree
export function generateAsciiTree(node, prefix = '', isLast = true, isRoot = true) {
  let result = ''

  if (isRoot) {
    result = node.title + '\n'
  } else {
    const connector = isLast ? '└── ' : '├── '
    result = prefix + connector + node.title + '\n'
  }

  const newPrefix = isRoot ? '' : prefix + (isLast ? '    ' : '│   ')

  node.children.forEach((child, index) => {
    const isChildLast = index === node.children.length - 1
    result += generateAsciiTree(child, newPrefix, isChildLast, false)
  })

  return result
}
