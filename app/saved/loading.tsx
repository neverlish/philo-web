export default function SavedLoading() {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background shadow-2xl animate-pulse">
      {/* Header: matches Header component (flex justify-between p-6) */}
      <div className="flex items-center justify-between p-6">
        <div className="w-10" />
        <div className="w-16 h-5 rounded-full bg-muted" />
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded-full bg-muted" />
          <div className="w-10 h-10 rounded-full bg-muted" />
        </div>
      </div>

      {/* Tabs: matches "flex border-b border-border px-6" */}
      <div className="flex border-b border-border px-6">
        <div className="flex-1 py-3 flex justify-center">
          <div className="w-14 h-4 rounded-full bg-muted" />
        </div>
        <div className="flex-1 py-3 flex justify-center">
          <div className="w-20 h-4 rounded-full bg-muted" />
        </div>
      </div>

      <div className="flex-1 px-6 pt-4 pb-32">
        {/* Category filter pills */}
        <div className="flex gap-3 mb-6 overflow-hidden">
          {[32, 56, 52, 52, 56].map((w, i) => (
            <div key={i} className="flex-none h-9 rounded-full bg-muted" style={{ width: w }} />
          ))}
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="w-16 h-3 rounded-full bg-muted" />
                <div className="w-12 h-3 rounded-full bg-muted" />
              </div>
              <div className="w-3/4 h-4 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="w-full h-3 rounded-full bg-muted" />
                <div className="w-2/3 h-3 rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
