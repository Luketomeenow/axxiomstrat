import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { PasswordConfirmDialog } from './PasswordConfirmDialog'

export function PasswordGatedDeleteButton({
  label,
  title,
  message,
  onDelete,
  className = 'shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-300',
  iconClassName = 'h-3.5 w-3.5',
}: {
  label: string
  title?: string
  message?: string
  onDelete: () => void
  className?: string
  iconClassName?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
        aria-label={`Delete ${label}`}
      >
        <Trash2 className={iconClassName} aria-hidden />
      </button>
      <PasswordConfirmDialog
        open={open}
        title={title ?? `Delete “${label}”?`}
        message={
          message ??
          'This cannot be undone. Enter the hub password to remove this item for everyone.'
        }
        onClose={() => setOpen(false)}
        onConfirmed={onDelete}
      />
    </>
  )
}
