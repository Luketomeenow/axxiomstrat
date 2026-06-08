const ICON_SRC = '/icons/icon.svg'

type AppIconProps = {
  className?: string
  /** Accessible label when the icon is meaningful content; omit when decorative. */
  label?: string
}

/** Branded hub mark (navy + brass) — favicon and in-app shell. */
export function AppIcon({ className = 'h-10 w-10', label }: AppIconProps) {
  return (
    <img
      src={ICON_SRC}
      alt={label ?? ''}
      className={className}
      width={40}
      height={40}
      decoding="async"
      aria-hidden={label ? undefined : true}
    />
  )
}
