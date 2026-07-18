import { ArrowUpRight } from 'lucide-react'
import { DOCS_URL } from '@/config'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const FAQS = [
  {
    question: 'What is pg-kinetic?',
    answer: 'pg-kinetic is an open-source Rust PostgreSQL wire proxy for transaction pooling, routing, sharding, policy, observability, and regression testing.',
  },
  {
    question: 'How does pg-kinetic handle overload?',
    answer: 'It applies queues and deadlines per route. When a route is full, pg-kinetic returns a PostgreSQL 53300 overload error quickly, keeping the capacity assigned to other routes available.',
  },
  {
    question: 'Does pg-kinetic require application driver changes?',
    answer: 'Applications continue to speak the PostgreSQL protocol. Start with a connection-string change, keep the original PostgreSQL path during a canary, and validate driver and session-state behavior for the workload.',
  },
  {
    question: 'Where can I find the operator documentation?',
    answer: 'The documentation covers configuration, migration, routing, sharding, policy, observability, testing, and benchmarks.',
    href: DOCS_URL,
  },
]

export function Faq() {
  return (
    <section id="faq" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading index="answers" title="PostgreSQL proxy questions, answered.">
          A concise operational reference for evaluating pg-kinetic before you change a connection string.
        </SectionHeading>

        <div className="mt-10 max-w-4xl border-t border-white/10">
          {FAQS.map((faq, index) => (
            <Reveal key={faq.question} delay={index * 70}>
              <article className="border-b border-white/10 py-6 md:grid md:grid-cols-[0.7fr_1fr] md:gap-10">
                <h3 className="text-base font-semibold tracking-tight text-zinc-100">{faq.question}</h3>
                <div className="mt-2 md:mt-0">
                  <p className="faq-answer text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                  {faq.href && (
                    <a
                      href={faq.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-pg-bright transition-colors hover:text-white"
                    >
                      Read the operator docs <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
