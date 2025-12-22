import { useState } from 'react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { treeToMarkdown, treeToJSON, downloadFile } from '../lib/export-utils'

export function ExportPanel({ tree }) {
  const [format, setFormat] = useState('markdown')
  const [copied, setCopied] = useState(false)

  if (!tree) return null

  const content = format === 'markdown' ? treeToMarkdown(tree) : treeToJSON(tree)
  const filename = `${tree.title.toLowerCase().replace(/\s+/g, '-')}.${format === 'markdown' ? 'md' : 'json'}`

  const handleDownload = () => {
    const mimeType = format === 'markdown' ? 'text/markdown' : 'application/json'
    downloadFile(content, filename, mimeType)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <Card>
        <h3 className="font-semibold text-white mb-4">Export Format</h3>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="format"
              value="markdown"
              checked={format === 'markdown'}
              onChange={(e) => setFormat(e.target.value)}
              className="text-teal-500 focus:ring-teal-500"
            />
            <span className="text-white">📄 Markdown</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="format"
              value="json"
              checked={format === 'json'}
              onChange={(e) => setFormat(e.target.value)}
              className="text-teal-500 focus:ring-teal-500"
            />
            <span className="text-white">📋 JSON</span>
          </label>
        </div>

        <p className="text-sm text-slate-400 mt-3">
          {format === 'markdown'
            ? 'Markdown format is ideal for documentation and sharing with humans.'
            : 'JSON format preserves the full tree structure and can be re-imported.'}
        </p>
      </Card>

      {/* Preview */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Preview</h3>
          <span className="text-xs text-slate-400 font-mono">{filename}</span>
        </div>
        <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto text-sm text-slate-300 font-mono max-h-[400px] overflow-y-auto">
          {content}
        </pre>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="orange" onClick={handleDownload} className="flex-1">
          ⬇️ Download {format === 'markdown' ? '.md' : '.json'}
        </Button>
        <Button variant={copied ? "primary" : "secondary"} onClick={handleCopy}>
          {copied ? '✓ Copied!' : '📋 Copy'}
        </Button>
      </div>
    </div>
  )
}
