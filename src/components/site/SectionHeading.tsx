import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

export function SectionHeading({
  index,
  title,
  children,
  tone = 'text-pg-bright',
}: {
  index: string
  title: string
  children?: ReactNode
  tone?: string
}) {
  return (
    <Reveal>
      <div className="max-w-3xl">
        <p className={`font-mono text-xs tracking-[0.18em] ${tone}`}>
          <span className="text-zinc-600">~/</span>
          {index}
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] md:text-[2.6rem] md:leading-[1.1]">{title}</h2>
        {children && <p className="mt-4 text-muted-foreground">{children}</p>}
      </div>
    </Reveal>
  )
}
