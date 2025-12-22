import { useState } from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Input, Textarea } from './ui/Input'
import { TEMPLATES, getTemplate } from '../lib/templates'

export function Onboarding({ onCreate, onLoadTemplate }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('Blank')

  const handleCreate = () => {
    if (selectedTemplate === 'Blank') {
      onCreate(title || 'New Prompt Tree', description)
    } else {
      const template = getTemplate(selectedTemplate)
      if (template) {
        if (title) template.title = title
        if (description) template.description = description
        onLoadTemplate(template)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full animate-fade-in">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">🏭</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent mb-4">
            Prompt Factory AI
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Build structured, hierarchical prompts for AI systems.
            Create once, export anywhere.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="text-center">
            <div className="text-3xl mb-3">🌳</div>
            <h3 className="font-semibold text-white mb-2">Hierarchical Structure</h3>
            <p className="text-sm text-slate-400">
              Build complex prompt trees with unlimited nesting
            </p>
          </Card>
          <Card className="text-center">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-semibold text-white mb-2">Templates</h3>
            <p className="text-sm text-slate-400">
              Start from battle-tested templates for common use cases
            </p>
          </Card>
          <Card className="text-center">
            <div className="text-3xl mb-3">📤</div>
            <h3 className="font-semibold text-white mb-2">Export Anywhere</h3>
            <p className="text-sm text-slate-400">
              Download as Markdown or JSON for any AI system
            </p>
          </Card>
        </div>

        {/* Create Form */}
        <Card className="max-w-xl mx-auto">
          <h2 className="text-xl font-semibold text-white mb-4">Get Started</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Choose a Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="input cursor-pointer"
              >
                {Object.entries(TEMPLATES).map(([name, template]) => (
                  <option key={name} value={name}>
                    {template.icon} {name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Title (optional)"
              placeholder="e.g., Customer Support Bot"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Textarea
              label="Description (optional)"
              placeholder="Brief description of your prompt tree"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />

            <Button onClick={handleCreate} className="w-full">
              Create Prompt Tree →
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
