import { Github } from 'lucide-react'
import { Logo } from './Logo'
import { GITHUB_URL, ISSUES_URL, DOC_CARDS } from '@/config'

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#05070c]/80 py-12 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <Logo size={24} />
              <span className="font-mono text-sm font-semibold">pg-kinetic</span>
            </div>
            <p className="mt-3 font-mono text-[12px] leading-relaxed text-zinc-300">
              Rust PostgreSQL proxy for pooling, routing, sharding, policy,
              observability, and performance regression testing.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">project</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-zinc-300 transition-colors hover:text-foreground">
                    <Github className="h-3.5 w-3.5" /> GitHub
                  </a>
                </li>
                <li>
                  <a href={ISSUES_URL} target="_blank" rel="noreferrer" className="text-zinc-300 transition-colors hover:text-foreground">
                    Issues
                  </a>
                </li>
                <li>
                  <a href="#pressure" className="text-zinc-300 transition-colors hover:text-foreground">
                    Under pressure
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">docs</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {DOC_CARDS.slice(1, 5).map((doc) => (
                  <li key={doc.title}>
                    <a href={doc.href} target="_blank" rel="noreferrer" className="text-zinc-300 transition-colors hover:text-foreground">
                      {doc.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">site</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><a href="#features" className="text-zinc-300 transition-colors hover:text-foreground">Features</a></li>
                <li><a href="#architecture" className="text-zinc-300 transition-colors hover:text-foreground">Architecture</a></li>
                <li><a href="#pressure" className="text-zinc-300 transition-colors hover:text-foreground">Under load</a></li>
                <li><a href="#docs" className="text-zinc-300 transition-colors hover:text-foreground">Docs</a></li>
                <li><a href="#faq" className="text-zinc-300 transition-colors hover:text-foreground">FAQ</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-6">
          <p className="font-mono text-[11px] text-zinc-400">pg-kinetic / rust / PostgreSQL wire protocol</p>
        </div>
      </div>
    </footer>
  )
}
