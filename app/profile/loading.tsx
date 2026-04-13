export default function ProfileLoading() {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background shadow-2xl animate-pulse">
      {/* Header: matches Header component (flex justify-between p-6) */}
      <div className="flex items-center justify-between p-6">
        <div className="w-10" />
        <div className="w-14 h-5 rounded-full bg-muted" />
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded-full bg-muted" />
          <div className="w-10 h-10 rounded-full bg-muted" />
        </div>
      </div>

      <div className="flex-1 px-6 pt-2 pb-32">
        {/* Profile section */}
        <div className="py-6 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="w-28 h-5 rounded-full bg-muted" />
            <div className="w-36 h-3 rounded-full bg-muted" />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 text-center space-y-2">
              <div className="w-8 h-7 rounded-full bg-muted mx-auto" />
              <div className="w-12 h-3 rounded-full bg-muted mx-auto" />
            </div>
          ))}
        </div>

        {/* Monthly report card */}
        <div className="mb-8 bg-card border border-border rounded-xl p-5 space-y-3">
          <div className="w-16 h-3 rounded-full bg-muted" />
          <div className="flex gap-4">
            <div className="w-20 h-3 rounded-full bg-muted" />
            <div className="w-16 h-3 rounded-full bg-muted" />
            <div className="w-16 h-3 rounded-full bg-muted" />
          </div>
          <div className="w-40 h-3 rounded-full bg-muted" />
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
              <div className="w-4 h-4 rounded-full bg-muted flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
