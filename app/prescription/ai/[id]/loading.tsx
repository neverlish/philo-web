export default function PrescriptionLoading() {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background animate-pulse">
      {/* Header: ArrowLeft + centered title */}
      <div className="px-4 py-6 flex items-center justify-between">
        <div className="w-9 h-9 rounded-full bg-muted" />
        <div className="w-24 h-5 rounded-full bg-muted" />
        <div className="w-9" />
      </div>

      <div className="flex-1 px-6 py-4">
        {/* Title area */}
        <div className="mb-10 text-center space-y-3">
          <div className="w-48 h-3 rounded-full bg-muted mx-auto" />
          <div className="w-56 h-7 rounded-full bg-muted mx-auto" />
          <div className="w-36 h-3 rounded-full bg-muted mx-auto" />
        </div>

        {/* Quote card: rounded-3xl p-8 */}
        <div className="bg-card rounded-3xl p-8 mb-8">
          {/* "오늘의 처방" pill badge */}
          <div className="w-20 h-6 rounded-full border border-muted bg-muted mb-6" />
          {/* Quote text lines */}
          <div className="space-y-2 mb-8">
            <div className="w-full h-5 rounded-full bg-muted" />
            <div className="w-full h-5 rounded-full bg-muted" />
            <div className="w-3/5 h-5 rounded-full bg-muted" />
          </div>
          {/* Philosopher row */}
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="w-24 h-4 rounded-full bg-muted" />
              <div className="w-32 h-3 rounded-full bg-muted" />
            </div>
            <div className="w-11 h-11 rounded-full bg-muted" />
          </div>
        </div>

        {/* Wisdom section: accent bar + title + text */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-muted rounded-full" />
            <div className="w-16 h-3 rounded-full bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="w-full h-4 rounded-full bg-muted" />
            <div className="w-full h-4 rounded-full bg-muted" />
            <div className="w-2/3 h-4 rounded-full bg-muted" />
          </div>
        </div>

        {/* Action item section: 실천하기 card */}
        <div className="mb-12 rounded-2xl bg-muted/30 p-6 space-y-3">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-7 h-7 rounded-lg bg-muted" />
            <div className="w-16 h-3 rounded-full bg-muted" />
          </div>
          <div className="w-full h-4 rounded-full bg-muted" />
          <div className="w-4/5 h-4 rounded-full bg-muted" />
        </div>

        {/* Footer buttons */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="h-14 rounded-xl bg-muted" />
          <div className="h-14 rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  )
}
