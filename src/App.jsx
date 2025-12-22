import { useState } from 'react'
import { usePromptTree } from './hooks/usePromptTree'
import { Sidebar } from './components/Sidebar'
import { Onboarding } from './components/Onboarding'
import { TreeBuilder } from './components/TreeBuilder'
import { TreeVisualization } from './components/TreeVisualization'
import { ExportPanel } from './components/ExportPanel'
import { About } from './components/About'
import { Tabs } from './components/ui/Tabs'
import { jsonToTree } from './lib/export-utils'

const TABS = [
  { id: 'builder', label: 'Builder', icon: '📝' },
  { id: 'visualize', label: 'Visualize', icon: '🌳' },
  { id: 'export', label: 'Export', icon: '📤' },
  { id: 'about', label: 'About', icon: 'ℹ️' },
]

function App() {
  const [activeTab, setActiveTab] = useState('builder')
  const {
    tree,
    selectedNodeId,
    setSelectedNodeId,
    create,
    loadTree,
    add,
    remove,
    update,
    updateMetadata,
    clear
  } = usePromptTree()

  const handleImport = (jsonString) => {
    const result = jsonToTree(jsonString)
    if (result.success) {
      loadTree(result.tree)
    } else {
      alert(`Import failed: ${result.error}`)
    }
  }

  // Show onboarding if no tree
  if (!tree) {
    return (
      <div className="min-h-screen bg-slate-900 flex">
        <Sidebar
          tree={null}
          onLoadTemplate={loadTree}
          onImport={handleImport}
        />
        <main className="flex-1 overflow-y-auto">
          <Onboarding onCreate={create} onLoadTemplate={loadTree} />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <Sidebar
        tree={tree}
        onLoadTemplate={loadTree}
        onImport={handleImport}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Tabs */}
          <div className="mb-6">
            <Tabs
              tabs={TABS}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === 'builder' && (
              <TreeBuilder
                tree={tree}
                selectedNodeId={selectedNodeId}
                onSelectNode={setSelectedNodeId}
                onAdd={add}
                onUpdate={update}
                onDelete={remove}
                onUpdateMetadata={updateMetadata}
                onClear={clear}
              />
            )}

            {activeTab === 'visualize' && (
              <TreeVisualization tree={tree} />
            )}

            {activeTab === 'export' && (
              <ExportPanel tree={tree} />
            )}

            {activeTab === 'about' && (
              <About />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
