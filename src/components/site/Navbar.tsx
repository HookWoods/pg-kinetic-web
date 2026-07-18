import { useEffect, useRef, useState } from 'react'
import { Github, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Logo } from './Logo'
import { GITHUB_URL, DOCS_URL } from '@/config'

const NAV_LINKS = [
  { label: '/features', href: '#features' },
  { label: '/architecture', href: '#architecture' },
  { label: '/under-load', href: '#pressure' },
  { label: '/docs', href: '#docs' },
]

export function Navbar() {
  const [active, setActive] = useState('')
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)
  const [indicator, setIndicator] = useState({ left: 0, width: 0, on: false })
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const listRef = useRef<HTMLDivElement>(null)

  // active-section tracking + read progress
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)

      const probe = window.scrollY + window.innerHeight * 0.35
      let current = ''
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.href.slice(1))
        if (el && el.offsetTop <= probe) current = link.href
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // sliding indicator follows the active link
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const el = active ? linkRefs.current[active] : null
      if (el && listRef.current) {
        setIndicator({ left: el.offsetLeft, width: el.offsetWidth, on: true })
      } else {
        setIndicator((s) => ({ ...s, on: false }))
      }
    })
    return () => window.cancelAnimationFrame(frame)
  }, [active])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* read progress hairline */}
      <div
        className="h-[2px] origin-left bg-gradient-to-r from-pg/70 via-pg-bright to-pg/70"
        style={{ transform: `scaleX(${progress})`, opacity: progress > 0.01 ? 1 : 0 }}
        aria-hidden="true"
      />

      <div className="px-4 pt-3">
        <nav className="glass relative mx-auto flex h-[54px] max-w-5xl items-center gap-2 rounded-full pl-4 pr-2">
          {/* identity */}
          <a href="#top" className="flex shrink-0 items-center gap-2.5">
            <Logo size={24} />
            <span className="font-mono text-[14px] font-semibold tracking-tight text-foreground">
              pg-kinetic
            </span>
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-pulse shadow-[0_0_6px_1px_rgba(31,217,138,0.6)]"
              title="proxy status: accepting connections"
            />
          </a>

          {/* section links with sliding indicator */}
          <div ref={listRef} className="relative mx-auto hidden items-center md:flex">
            <span
              className="absolute top-1/2 h-8 -translate-y-1/2 rounded-full bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-300"
              style={{
                left: indicator.left,
                width: indicator.width,
                opacity: indicator.on ? 1 : 0,
                transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
              }}
              aria-hidden="true"
            />
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                ref={(el) => {
                  linkRefs.current[link.href] = el
                }}
                aria-current={active === link.href ? 'true' : undefined}
                className={`relative z-10 rounded-full px-3.5 py-2 font-mono text-[12.5px] transition-colors duration-200 ${
                  active === link.href ? 'text-pg-bright' : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* repo + docs */}
          <div className="ml-auto hidden shrink-0 items-center gap-2 md:flex">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="pg-kinetic on GitHub"
              className="sheen flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 transition-all duration-200 hover:border-white/25 hover:text-zinc-50 active:scale-95"
            >
              <Github className="h-4 w-4" />
            </a>
            <Button
              size="sm"
              asChild
              className="sheen h-9 rounded-full px-4 font-mono text-[12px] font-semibold transition-transform duration-200 active:scale-95"
            >
              <a href={DOCS_URL} target="_blank" rel="noreferrer">
                ~/docs
              </a>
            </Button>
          </div>

          {/* mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="ml-auto md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-white/10 bg-[#070a10]/95 backdrop-blur-xl">
              <div className="mt-8 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-md px-3 py-2.5 font-mono text-sm transition-colors ${
                      active === link.href
                        ? 'bg-pg/10 text-pg-bright'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="my-3 h-px bg-white/10" />
                <Button variant="outline" asChild className="justify-start gap-2 font-mono text-[13px]">
                  <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                    <Github className="h-4 w-4" /> pg-kinetic
                  </a>
                </Button>
                <Button asChild className="mt-2 justify-start gap-2 font-mono text-[13px] font-semibold">
                  <a href={DOCS_URL} target="_blank" rel="noreferrer">
                    ~/docs
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  )
}
