import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export type TermLine = { type: 'cmd' | 'out' | 'comment'; text: string }

export function Terminal({ title, lines, copyText }: { title: string; lines: TermLine[]; copyText: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0f] shadow-2xl shadow-black/60">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-xs text-zinc-500">{title}</span>
        <button
          onClick={copy}
          aria-label="Copy commands"
          className="ml-auto rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <div className="overflow-x-auto p-4 font-mono text-[13px] leading-6">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre">
            {line.type === 'cmd' && <span className="mr-2 select-none text-primary">$</span>}
            <span
              className={
                line.type === 'cmd'
                  ? 'text-zinc-100'
                  : line.type === 'comment'
                    ? 'italic text-zinc-500'
                    : 'text-zinc-400'
              }
            >
              {line.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
