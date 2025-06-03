export function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="w-full h-[10px] bg-[var(--offwhite)] rounded-sm overflow-hidden">
      <div
        className="h-full bg-[var(--olive)]"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
