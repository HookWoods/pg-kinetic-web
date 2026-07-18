import { useCallback, useRef, type HTMLAttributes } from 'react'

/**
 * Glass surface with a cursor-tracking spotlight border (.spot in index.css).
 * Renders a div that feeds --mx/--my custom props on pointer move.
 */
export function GlassCard({
  className = '',
  deep = false,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { deep?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }, [])

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className={`${deep ? 'glass-deep' : 'glass'} spot ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
