export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="8" className="fill-primary/10 stroke-primary/60" strokeWidth="1.5" />
      {/* kinetic bolt through a wire path */}
      <path
        d="M17.5 6 9 18h5.5L13 26l8.5-12H16l1.5-8Z"
        className="fill-primary"
        strokeLinejoin="round"
      />
    </svg>
  )
}
