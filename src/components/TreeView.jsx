import { getAllNodes } from '../lib/tree-utils'

export function TreeView({ tree, selectedNodeId, onSelectNode }) {
  if (!tree) return null

  const nodes = getAllNodes(tree.root_node)

  return (
    <div className="space-y-1">
      {nodes.map(node => (
        <button
          key={node.id}
          onClick={() => onSelectNode(node.id)}
          className={`
            w-full text-left px-3 py-2 rounded-lg transition-all min-h-[44px]
            flex items-center gap-2
            ${selectedNodeId === node.id
              ? 'bg-teal-500/20 border border-teal-500/50 text-white'
              : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
            }
          `}
          style={{ paddingLeft: `${node.level * 20 + 12}px` }}
        >
          <span className="text-sm">
            {node.children.length > 0 ? '📁' : '📄'}
          </span>
          <span className="flex-1 truncate">{node.title}</span>
          {node.content && (
            <span className="text-xs text-slate-500 truncate max-w-[120px]">
              {node.content.slice(0, 30)}...
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
