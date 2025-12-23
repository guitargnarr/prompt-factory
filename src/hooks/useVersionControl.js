import { useState, useEffect, useCallback } from 'react'

const VERSION_STORAGE_KEY = 'prompt-factory-versions'
const MAX_VERSIONS = 50 // Maximum versions to keep

export function useVersionControl(tree) {
  const [versions, setVersions] = useState([])
  const [isRestoring, setIsRestoring] = useState(false)

  // Load versions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(VERSION_STORAGE_KEY)
    if (saved) {
      try {
        setVersions(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load versions:', e)
      }
    }
  }, [])

  // Save versions to localStorage
  useEffect(() => {
    if (versions.length > 0) {
      localStorage.setItem(VERSION_STORAGE_KEY, JSON.stringify(versions))
    }
  }, [versions])

  // Create a new version snapshot
  const saveVersion = useCallback((label = '') => {
    if (!tree) return null

    const version = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      label: label || `Version ${versions.length + 1}`,
      treeSnapshot: JSON.parse(JSON.stringify(tree)),
      nodeCount: countNodes(tree.root_node),
      treeTitle: tree.title
    }

    setVersions(prev => {
      const updated = [version, ...prev]
      // Keep only the most recent versions
      return updated.slice(0, MAX_VERSIONS)
    })

    return version
  }, [tree, versions.length])

  // Auto-save version (only if tree has changed significantly)
  const autoSaveVersion = useCallback(() => {
    if (!tree || isRestoring) return null

    // Check if we should auto-save (compare with latest version)
    if (versions.length > 0) {
      const latest = versions[0]
      const currentSnapshot = JSON.stringify(tree)
      const latestSnapshot = JSON.stringify(latest.treeSnapshot)

      // Don't save if nothing changed
      if (currentSnapshot === latestSnapshot) {
        return null
      }
    }

    return saveVersion('Auto-save')
  }, [tree, versions, saveVersion, isRestoring])

  // Get a specific version
  const getVersion = useCallback((versionId) => {
    return versions.find(v => v.id === versionId)
  }, [versions])

  // Delete a version
  const deleteVersion = useCallback((versionId) => {
    setVersions(prev => prev.filter(v => v.id !== versionId))
  }, [])

  // Clear all versions
  const clearVersions = useCallback(() => {
    setVersions([])
    localStorage.removeItem(VERSION_STORAGE_KEY)
  }, [])

  // Rename a version
  const renameVersion = useCallback((versionId, newLabel) => {
    setVersions(prev => prev.map(v =>
      v.id === versionId ? { ...v, label: newLabel } : v
    ))
  }, [])

  // Compare two versions (returns diff summary)
  const compareVersions = useCallback((versionId1, versionId2) => {
    const v1 = versions.find(v => v.id === versionId1)
    const v2 = versions.find(v => v.id === versionId2)

    if (!v1 || !v2) return null

    return {
      v1: { label: v1.label, nodeCount: v1.nodeCount, timestamp: v1.timestamp },
      v2: { label: v2.label, nodeCount: v2.nodeCount, timestamp: v2.timestamp },
      nodeCountDiff: v2.nodeCount - v1.nodeCount
    }
  }, [versions])

  // Set restoring flag (to prevent auto-save during restore)
  const setRestoring = useCallback((value) => {
    setIsRestoring(value)
  }, [])

  return {
    versions,
    saveVersion,
    autoSaveVersion,
    getVersion,
    deleteVersion,
    clearVersions,
    renameVersion,
    compareVersions,
    setRestoring,
    isRestoring
  }
}

// Helper to count nodes in tree
function countNodes(node) {
  if (!node) return 0
  return 1 + node.children.reduce((sum, child) => sum + countNodes(child), 0)
}
