import { ArrowUpRight, BookOpen } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { DOC_CARDS, DOCS_URL, GITHUB_URL } from '@/config'

export function Docs() {
  return (
    <section id="docs" className="relative scroll-mt-24 py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading index="docs" title="Read the manual, not the marketing">
          Each subsystem has an operator guide with deployment and verification details.
        </SectionHeading>

        <Reveal delay={120}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              asChild
              className="sheen glow-primary gap-2 rounded-full px-6 font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <a href={DOCS_URL} target="_blank" rel="noreferrer">
                <BookOpen className="h-4 w-4" />
                Read the docs
              </a>
            </Button>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="glass sheen inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium text-zinc-200 transition-all duration-200 hover:-translate-y-0.5 hover:text-white active:scale-[0.98]"
            >
              <FaGithub className="h-4 w-4" />
              View GitHub
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {DOC_CARDS.map((d, i) => (
              <Reveal key={d.title} delay={i * 55}>
                <a
                  href={d.href}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-chip sheen group inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[12px] text-zinc-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-pg/50 hover:text-pg-bright active:scale-95"
                >
                  {d.title.toLowerCase()}
                  <ArrowUpRight className="h-3 w-3 opacity-40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </a>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
