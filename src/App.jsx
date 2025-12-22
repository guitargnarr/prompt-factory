import { useState } from 'react'
import { usePromptTree } from './hooks/usePromptTree'
import { Onboarding } from './components/Onboarding'
import { TreeBuilder } from './components/TreeBuilder'
import { TreeVisualization } from './components/TreeVisualization'
import { ExportPanel } from './components/ExportPanel'
import { About } from './components/About'
import { TemplateDrawer } from './components/TemplateDrawer'
import { jsonToTree } from './lib/export-utils'

const NAV_ITEMS = [
  { id: 'builder', label: 'Builder' },
  { id: 'visualize', label: 'Visualize' },
  { id: 'export', label: 'Export' },
  { id: 'about', label: 'About' },
]

function App() {
  const [activeTab, setActiveTab] = useState('builder')
  const [showTemplates, setShowTemplates] = useState(false)
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

  const handleLoadTemplate = (template) => {
    loadTree(template)
    setShowTemplates(false)
  }

  // Show onboarding if no tree
  if (!tree) {
    return (
      <div className="min-h-screen bg-slate-900">
        {/* Top Navigation */}
        <header className="border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏭</span>
              <span className="font-bold text-white">Prompt Factory</span>
            </div>
            <nav className="flex items-center gap-1">
              <button
                onClick={() => setShowTemplates(true)}
                className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                Templates
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                About
              </button>
            </nav>
          </div>
        </header>

        <main className="overflow-y-auto">
          <Onboarding onCreate={create} onLoadTemplate={loadTree} />
        </main>

        <TemplateDrawer
          isOpen={showTemplates}
          onClose={() => setShowTemplates(false)}
          onLoadTemplate={handleLoadTemplate}
          onImport={handleImport}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏭</span>
            <span className="font-bold text-white">Prompt Factory</span>
            {tree && (
              <span className="text-slate-500 text-sm ml-2">/ {tree.title}</span>
            )}
          </div>

          {/* Main Navigation */}
          <nav className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-lg">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-teal-500 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTemplates(true)}
              className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>📋</span>
              <span className="hidden sm:inline">Templates</span>
            </button>
            <button
              onClick={() => {
                if (confirm('Start a new prompt tree? Current work will be cleared.')) {
                  clear()
                }
              }}
              className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              + New
            </button>
          </div>
        </div>
      </header>

      <main className="overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
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

      <TemplateDrawer
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onLoadTemplate={handleLoadTemplate}
        onImport={handleImport}
      />
    </div>
  )
}

export default App
