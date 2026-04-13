export default function SavedLoading() {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background animate-pulse">
      {/* Header */}
      <div className="px-4 py-6">
        <div className="w-20 h-5 rounded-full bg-muted mx-auto" />
      </div>

      {/* Filter tabs */}
      <div className="px-6 mb-4 flex gap-2">
        {[60, 48, 56].map((w, i) => (
          <div key={i} className={`h-8 rounded-full bg-muted`} style={{ width: w }} />
        ))}
      </div>

      {/* Cards */}
      <div className="px-6 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-2.5">
            <div className="flex justify-between">
              <div className="w-16 h-3 rounded-full bg-muted" />
              <div className="w-10 h-3 rounded-full bg-muted" />
            </div>
            <div className="w-3/4 h-4 rounded-full bg-muted" />
            <div className="w-full h-3 rounded-full bg-muted" />
            <div className="w-1/2 h-3 rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
