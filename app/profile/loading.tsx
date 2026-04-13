export default function ProfileLoading() {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background animate-pulse">
      {/* Header */}
      <div className="px-4 py-6">
        <div className="w-16 h-5 rounded-full bg-muted mx-auto" />
      </div>

      <div className="flex-1 px-6 pt-2">
        {/* Profile section */}
        <div className="py-6 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex-shrink-0" />
          <div className="space-y-2">
            <div className="w-28 h-5 rounded-full bg-muted" />
            <div className="w-40 h-3 rounded-full bg-muted" />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-2">
              <div className="w-8 h-7 rounded-full bg-muted mx-auto" />
              <div className="w-12 h-3 rounded-full bg-muted mx-auto" />
            </div>
          ))}
        </div>

        {/* Menu items */}
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="w-16 h-4 rounded-full bg-muted" />
                <div className="w-24 h-3 rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
