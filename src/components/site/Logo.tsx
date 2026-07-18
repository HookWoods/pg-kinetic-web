export function Logo({ size = 28 }: { size?: number }) {
  return (
    <img
      src="/pg-kinetic-mark.svg"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className="shrink-0"
    />
  )
}
