import clsx from 'clsx'

interface EventAILLogoProps {
  variant?: 'full' | 'hero' | 'header' | 'mark'
  className?: string
}

export function EventAILLogo({ variant = 'full', className }: EventAILLogoProps) {
  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 160 160"
        className={clsx('h-11 w-11', className)}
        aria-label="EventAIL logo"
        role="img"
      >
        <defs>
          <linearGradient id="eventailMarkGradient" x1="22" y1="18" x2="136" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FF7E4D" />
            <stop offset="1" stopColor="#8C5BD6" />
          </linearGradient>
        </defs>

        <circle cx="80" cy="80" r="64" fill="url(#eventailMarkGradient)" />
        <circle
          cx="80"
          cy="80"
          r="50"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="5.5"
          strokeDasharray="22 16"
          strokeLinecap="round"
          opacity="0.92"
        />
        {[
          [80, 32],
          [114, 46],
          [128, 80],
          [114, 114],
          [80, 128],
          [46, 114],
          [32, 80],
          [46, 46],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="7.5" fill="#FFFFFF" />
        ))}

        <path
          d="M57 112L80 50L103 112H90L84 96H67L61 112H57Z"
          fill="#FFFFFF"
        />
        <path
          d="M70 87C85 82 93 81 93 72C93 64 86 58 76 58"
          fill="none"
          stroke="url(#eventailMarkGradient)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M80 42L70 56H77V78H83V56H90L80 42Z"
          fill="#FFFFFF"
        />
      </svg>
    )
  }

  const isHeader = variant === 'header'
  const isHero = variant === 'hero'

  return (
    <div
      className={clsx(
        'inline-flex items-center',
        isHeader ? 'gap-2.5' : 'flex-col text-center',
        isHero ? 'gap-3' : !isHeader && 'gap-5',
        className,
      )}
      aria-label="EventAIL logo"
      role="img"
    >
      <EventAILLogo
        variant="mark"
        className={clsx(
          'shrink-0',
          isHeader && 'h-9 w-9',
          isHero && 'h-14 w-14 sm:h-16 sm:w-16',
          !isHeader && !isHero && 'h-28 w-28 sm:h-36 sm:w-36',
        )}
      />

      <div className={clsx(isHeader ? 'leading-none' : 'space-y-1')}>
        <div
          className={clsx(
            'font-bold tracking-[-0.02em]',
            isHeader ? 'text-[1.18rem] sm:text-[1.3rem]' : isHero ? 'text-[2.2rem] sm:text-[3.1rem]' : 'text-[2.5rem] sm:text-[4.25rem]',
          )}
          style={{ fontFamily: 'var(--font-display)', color: 'var(--chalk)' }}
        >
          Event<span style={{ color: 'var(--ember)' }}>AIL</span>
        </div>
        <div
          className={clsx(
            'uppercase',
            isHeader ? 'text-[0.5rem] sm:text-[0.56rem]' : isHero ? 'text-[0.58rem] sm:text-[0.74rem]' : 'text-[0.7rem] sm:text-[0.9rem]',
          )}
          style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.22em', color: 'var(--faint)' }}
        >
          Conference Production · 7 Agents
        </div>
      </div>
    </div>
  )
}
