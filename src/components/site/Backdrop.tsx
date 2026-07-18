import { useEffect, useRef } from 'react'

type Wire = { y: number; amp: number; freq: number; phase: number; alpha: number }
type Pulse = { wire: number; t: number; speed: number; green: boolean }

/**
 * Signal-field backdrop: this is a wire proxy, so the background is wires.
 * A fine engineering grid (CSS), one restrained blue glow, film grain, and a
 * canvas of slow-breathing signal lines carrying packet pulses left→right.
 */
export function Backdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let lastFrame = 0
    let running = false
    let width = 0
    let height = 0
    let dpr = 1
    let wires: Wire[] = []
    let pulses: Pulse[] = []

    const wireY = (w: Wire, x: number, now: number) =>
      w.y + Math.sin(x * w.freq + w.phase + now * 0.00012) * w.amp

    const seed = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = 6
      wires = Array.from({ length: count }, (_, i) => ({
        y: (height * 1.05 * (i + 0.7)) / (count + 1),
        amp: 30 + Math.random() * 55,
        freq: 0.0009 + Math.random() * 0.0009,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.07 + Math.random() * 0.06,
      }))
      pulses = Array.from({ length: 9 }, () => ({
        wire: Math.floor(Math.random() * count),
        t: Math.random(),
        speed: 0.025 + Math.random() * 0.04,
        green: Math.random() < 0.22,
      }))
    }

    let last = performance.now()
    const draw = (now: number) => {
      if (!running) return
      if (!reduced && now - lastFrame < 33) {
        raf = requestAnimationFrame(draw)
        return
      }
      lastFrame = now
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      ctx.clearRect(0, 0, width, height)

      // wires
      ctx.lineWidth = 1
      for (const w of wires) {
        ctx.strokeStyle = `rgba(128, 168, 255, ${w.alpha})`
        ctx.beginPath()
        for (let x = 0; x <= width; x += 14) {
          const y = wireY(w, x, now)
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // pulses with trailing glow
      ctx.globalCompositeOperation = 'lighter'
      for (const p of pulses) {
        p.t += p.speed * dt
        if (p.t > 1.05) {
          p.t = -0.05
          p.wire = Math.floor(Math.random() * wires.length)
          p.green = Math.random() < 0.25
        }
        const w = wires[p.wire]
        const x = p.t * width
        const y = wireY(w, x, now)
        const rgb = p.green ? '64, 224, 160' : '122, 168, 255'

        const tail = 160
        const trail = ctx.createLinearGradient(x - tail, y, x, y)
        trail.addColorStop(0, `rgba(${rgb}, 0)`)
        trail.addColorStop(1, `rgba(${rgb}, 0.4)`)
        ctx.strokeStyle = trail
        ctx.lineWidth = 1.4
        ctx.beginPath()
        for (let tx = Math.max(0, x - tail); tx <= x; tx += 8) {
          const ty = wireY(w, tx, now)
          if (tx === Math.max(0, x - tail)) ctx.moveTo(tx, ty)
          else ctx.lineTo(tx, ty)
        }
        ctx.stroke()

        // soft halo + bright core
        const halo = ctx.createRadialGradient(x, y, 0, x, y, 14)
        halo.addColorStop(0, `rgba(${rgb}, 0.35)`)
        halo.addColorStop(1, `rgba(${rgb}, 0)`)
        ctx.fillStyle = halo
        ctx.fillRect(x - 14, y - 14, 28, 28)
        const dot = ctx.createRadialGradient(x, y, 0, x, y, 4)
        dot.addColorStop(0, `rgba(${rgb}, 1)`)
        dot.addColorStop(1, `rgba(${rgb}, 0)`)
        ctx.fillStyle = dot
        ctx.fillRect(x - 4, y - 4, 8, 8)
      }
      ctx.globalCompositeOperation = 'source-over'

      if (!reduced) raf = requestAnimationFrame(draw)
    }

    seed()
    if (reduced) {
      running = true
      draw(performance.now())
    } else {
      const updatePlayback = () => {
        const shouldRun = document.visibilityState === 'visible'
        if (shouldRun && !running) {
          running = true
          last = performance.now()
          raf = requestAnimationFrame(draw)
        } else if (!shouldRun && running) {
          running = false
          cancelAnimationFrame(raf)
        }
      }

      updatePlayback()
      document.addEventListener('visibilitychange', updatePlayback)

      const onResize = () => seed()
      window.addEventListener('resize', onResize)
      return () => {
        running = false
        cancelAnimationFrame(raf)
        document.removeEventListener('visibilitychange', updatePlayback)
        window.removeEventListener('resize', onResize)
      }
    }

    const onResize = () => {
      seed()
      draw(performance.now())
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true">
      {/* base */}
      <div className="absolute inset-0 bg-[#04060b]" />

      {/* drifting aurora color fields */}
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />

      {/* signal wires, fade toward bottom */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 92%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 92%)',
        }}
      />

      {/* vignette keeps edges quiet */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 90% at 50% 40%, transparent 55%, rgba(2, 4, 9, 0.55) 100%)',
        }}
      />

      {/* film grain */}
      <div className="grain absolute inset-0" />
    </div>
  )
}
