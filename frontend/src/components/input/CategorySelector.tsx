import { CONFERENCE_CATEGORIES } from '../../lib/constants'

interface CategorySelectorProps {
  value: string
  onChange: (cat: string) => void
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const selectedCategory = CONFERENCE_CATEGORIES.find((category) => category.id === value) ?? CONFERENCE_CATEGORIES[0]

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="relative w-full">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg py-2.5 px-4 text-sm outline-none transition-all"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238b949e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            paddingRight: '36px',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent-indigo)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
          aria-label="Conference Category"
        >
          {CONFERENCE_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
        {selectedCategory.desc}
      </p>
    </div>
  )
}
