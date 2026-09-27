export function ReflectionProgress({ total, reflected }: { total: number; reflected: number }) {
  return (
    <>
      <p className="text-2xl font-bold text-primary">{total > 0 ? `${Math.round(reflected / total * 100)}%` : '—'}</p>
      <p className="text-[11px] text-muted mt-0.5">회고 작성률</p>
    </>
  )
}
