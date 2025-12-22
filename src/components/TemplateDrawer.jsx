import { useState, useRef } from 'react'
import { Button } from './ui/Button'
import { TEMPLATES, getTemplate } from '../lib/templates'

const CATEGORIES = {
  General: ['Blank'],
  Security: ['Cybersecurity Incident Response'],
  Business: ['Marketing Campaign', 'Product Requirements'],
  Engineering: ['DevOps CI/CD Pipeline', 'Code Review Checklist'],
  AI: ['AI Agent Prompt'],
}

export function TemplateDrawer({ isOpen, onClose, onLoadTemplate, onImport }) {
  const [expandedCategory, setExpandedCategory] = useState('General')
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const handleTemplateSelect = (name) => {
    const template = getTemplate(name)
    if (template) {
      onLoadTemplate(template)
    }
  }

  const handleFileImport = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        onImport(event.target.result)
        onClose()
      }
      reader.readAsText(file)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 z-50 overflow-y-auto animate-slide-in">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Templates</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            {Object.entries(CATEGORIES).map(([category, templates]) => (
              <div key={category}>
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                  className="w-full flex items-center justify-between px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <span className="font-medium">{category}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedCategory === category ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedCategory === category && (
                  <div className="ml-3 mt-1 space-y-1">
                    {templates.map(name => {
                      const template = TEMPLATES[name]
                      return (
                        <button
                          key={name}
                          onClick={() => handleTemplateSelect(name)}
                          className="w-full text-left px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <span>{template.icon}</span>
                            <span>{name}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 group-hover:text-slate-400">
                            {template.description}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Import Section */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Import</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              Import JSON File
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
