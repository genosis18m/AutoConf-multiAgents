import { CONFERENCE_CATEGORIES } from '../../lib/constants'
import { ChevronDown } from 'lucide-react'

interface CategorySelectorProps {
  value: string
  onChange: (cat: string) => void
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const selectedCategory = CONFERENCE_CATEGORIES.find((category) => category.id === value) ?? CONFERENCE_CATEGORIES[0]

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="relative w-full">
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none"
          aria-hidden="true"
        >
          {selectedCategory.icon}
        </span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg py-2.5 pl-10 pr-12 text-sm outline-none transition-all"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#00E5FF')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
          aria-label="Conference Category"
        >
          {CONFERENCE_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--accent-cyan)' }}
        />
      </div>

      <p className="text-xs text-center" style={{ color: 'var(--text-dim)' }}>
        {selectedCategory.desc}
      </p>
    </div>
  )
}
