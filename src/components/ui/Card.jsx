export function Card({ children, className = '', interactive = false, ...props }) {
  return (
    <div
      className={`${interactive ? 'card-interactive' : 'card'} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function StatCard({ label, value, icon }) {
  return (
    <div className="card text-center">
      {icon && <div className="text-2xl mb-1">{icon}</div>}
      <div className="text-2xl font-bold text-teal-400">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  )
}
