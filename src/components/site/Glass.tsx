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
  const boundsRef = useRef<DOMRect | null>(null)

  const measureBounds = useCallback(() => {
    const el = ref.current
    if (!el) return null
    const bounds = el.getBoundingClientRect()
    boundsRef.current = bounds
    return bounds
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = boundsRef.current ?? measureBounds()
    if (!r) return
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }, [measureBounds])

  const onPointerEnter = useCallback(() => {
    measureBounds()
  }, [measureBounds])

  const onPointerLeave = useCallback(() => {
    boundsRef.current = null
  }, [])

  return (
    <div
      ref={ref}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`${deep ? 'glass-deep' : 'glass'} spot ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
