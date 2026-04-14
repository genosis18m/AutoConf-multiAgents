interface SpeederLoaderProps {
  label?: string
}

export function SpeederLoader({ label = 'Starting conference generation' }: SpeederLoaderProps) {
  return (
    <div className="speeder-loader" role="status" aria-label={label}>
      <span className="speeder-loader__exhaust">
        <span />
        <span />
        <span />
        <span />
      </span>
      <div className="speeder-loader__base">
        <span />
        <div className="speeder-loader__face" />
      </div>
    </div>
  )
}
