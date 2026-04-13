import clsx from 'clsx'
import { CONFERENCE_CATEGORIES } from '../../lib/constants'

interface CategorySelectorProps {
  value: string
  onChange: (cat: string) => void
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {CONFERENCE_CATEGORIES.map((cat) => {
        const isSelected = value === cat.id
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            className={clsx(
              'rounded-lg p-3 text-left transition-all duration-200 border',
              isSelected
                ? 'border-accent-cyan bg-accent-cyan/10'
                : 'border-border-subtle bg-bg-elevated hover:border-accent-cyan/40 hover:bg-accent-cyan/5',
            )}
            style={{
              borderColor: isSelected ? '#00E5FF' : undefined,
              boxShadow: isSelected ? '0 0 12px rgba(0,229,255,0.15)' : undefined,
            }}
          >
            <span className="text-xl block mb-1">{cat.icon}</span>
            <p className="text-xs font-semibold" style={{ color: isSelected ? '#00E5FF' : 'var(--text-primary)' }}>
              {cat.label}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
              {cat.desc}
            </p>
          </button>
        )
      })}
    </div>
  )
}
