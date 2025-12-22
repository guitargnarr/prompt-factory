export function Input({ label, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <input className={`input ${className}`} {...props} />
    </div>
  )
}

export function Textarea({ label, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <textarea className={`textarea ${className}`} {...props} />
    </div>
  )
}

export function Select({ label, options, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <select className={`input cursor-pointer ${className}`} {...props}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
