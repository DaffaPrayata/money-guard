export function ProgressBar({
  value,
  max,
  color = "#1e3a5f",
}: {
  value: number
  max: number
  color?: string
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="w-full h-2 rounded-full bg-[#f0f0f0] overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  )
}
