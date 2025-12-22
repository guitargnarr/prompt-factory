import { Card, StatCard } from './ui/Card'
import { generateAsciiTree, countNodes, getTreeDepth, countNodesWithContent } from '../lib/tree-utils'

export function TreeVisualization({ tree }) {
  if (!tree) return null

  const totalNodes = countNodes(tree.root_node)
  const depth = getTreeDepth(tree.root_node)
  const nodesWithContent = countNodesWithContent(tree.root_node)
  const asciiTree = generateAsciiTree(tree.root_node)

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Nodes" value={totalNodes} icon="🌳" />
        <StatCard label="Max Depth" value={depth} icon="📊" />
        <StatCard label="With Content" value={nodesWithContent} icon="📝" />
        <StatCard
          label="Coverage"
          value={`${Math.round((nodesWithContent / totalNodes) * 100)}%`}
          icon="✅"
        />
      </div>

      {/* ASCII Tree */}
      <Card>
        <h3 className="font-semibold text-white mb-4">Tree Structure</h3>
        <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto text-sm text-teal-400 font-mono">
          {asciiTree}
        </pre>
      </Card>

      {/* Metadata */}
      <Card>
        <h3 className="font-semibold text-white mb-3">Metadata</h3>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate-400">Version</dt>
            <dd className="text-white">{tree.version}</dd>
          </div>
          <div>
            <dt className="text-slate-400">ID</dt>
            <dd className="text-white font-mono">{tree.id}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Created</dt>
            <dd className="text-white">
              {new Date(tree.metadata.created_at).toLocaleDateString()}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Updated</dt>
            <dd className="text-white">
              {new Date(tree.metadata.updated_at).toLocaleDateString()}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}
