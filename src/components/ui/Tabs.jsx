export function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
