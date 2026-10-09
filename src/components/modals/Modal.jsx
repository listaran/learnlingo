import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export default function Modal({ title, onClose, children }) {
  const dialogRef = useRef(null)
  const triggerRef = useRef(document.activeElement)

  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    return () => {
      dialog.close()
      triggerRef.current?.focus?.()
    }
  }, [])

  return createPortal(
    <dialog
      ref={dialogRef}
      className="modal"
      aria-label={title}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => {
        if (event.target !== dialogRef.current) return
        const bounds = dialogRef.current.getBoundingClientRect()
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose()
      }}
    >
      <button className="modal-close icon-button" type="button" onClick={onClose} aria-label="Close dialog"><X size={24} /></button>
      {children}
    </dialog>,
    document.body,
  )
}
