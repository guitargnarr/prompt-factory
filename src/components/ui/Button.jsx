export function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    orange: 'btn-orange',
    ghost: 'px-4 py-2 min-h-[44px] text-slate-400 hover:text-white transition-colors'
  }

  return (
    <button
      className={`${baseClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
