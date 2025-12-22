import { Card } from './ui/Card'

export function About() {
  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <h2 className="text-xl font-semibold text-white mb-4">About Prompt Factory AI</h2>
        <p className="text-slate-300 mb-4">
          Prompt Factory AI helps you build structured, hierarchical prompts for AI systems.
          Instead of writing monolithic prompts, you can organize your instructions into
          logical sections and sub-sections.
        </p>
        <p className="text-slate-300">
          Create once, export to Markdown for documentation or JSON for programmatic use.
        </p>
      </Card>

      <Card>
        <h3 className="font-semibold text-white mb-4">Features</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-teal-400">🌳</span>
            <div>
              <strong className="text-white">Hierarchical Structure</strong>
              <p className="text-sm text-slate-400">Build complex prompt trees with unlimited nesting depth</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-teal-400">📋</span>
            <div>
              <strong className="text-white">Templates</strong>
              <p className="text-sm text-slate-400">Start from pre-built templates for common use cases</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-teal-400">📤</span>
            <div>
              <strong className="text-white">Export Options</strong>
              <p className="text-sm text-slate-400">Download as Markdown or JSON format</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-teal-400">💾</span>
            <div>
              <strong className="text-white">Auto-Save</strong>
              <p className="text-sm text-slate-400">Your work is automatically saved to your browser</p>
            </div>
          </li>
        </ul>
      </Card>

      <Card>
        <h3 className="font-semibold text-white mb-4">Use Cases</h3>
        <div className="grid gap-3">
          {[
            ['AI Agents', 'Build comprehensive system prompts for AI assistants'],
            ['Documentation', 'Create structured documentation that exports to Markdown'],
            ['Incident Response', 'Design playbooks for security incident handling'],
            ['Code Review', 'Build checklists for systematic code review'],
            ['Product Specs', 'Structure requirements documents'],
          ].map(([title, desc]) => (
            <div key={title} className="bg-slate-900 rounded-lg p-3">
              <strong className="text-white">{title}</strong>
              <p className="text-sm text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-white mb-2">Tips</h3>
        <ul className="text-sm text-slate-300 space-y-2">
          <li>• Use the sidebar templates to quickly get started</li>
          <li>• Click any node in the tree to edit it</li>
          <li>• Export to JSON if you want to re-import later</li>
          <li>• Your work is automatically saved to your browser</li>
        </ul>
      </Card>

      <div className="text-center text-sm text-slate-500">
        <p>Built with React + Tailwind CSS</p>
        <p>Part of the projectlavos.com portfolio</p>
      </div>
    </div>
  )
}
