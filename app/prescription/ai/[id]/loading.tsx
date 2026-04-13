export default function PrescriptionLoading() {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background animate-pulse">
      {/* Header */}
      <div className="px-4 py-6 flex items-center justify-between">
        <div className="w-9 h-9 rounded-full bg-muted" />
        <div className="w-24 h-5 rounded-full bg-muted mx-auto" />
        <div className="w-9" />
      </div>

      <div className="flex-1 px-6 py-4">
        {/* Title area */}
        <div className="mb-10 text-center space-y-3">
          <div className="w-48 h-4 rounded-full bg-muted mx-auto" />
          <div className="w-64 h-7 rounded-full bg-muted mx-auto" />
          <div className="w-40 h-4 rounded-full bg-muted mx-auto" />
        </div>

        {/* Quote card */}
        <div className="bg-card rounded-3xl p-8 mb-8 space-y-4">
          <div className="w-20 h-5 rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="w-full h-5 rounded-full bg-muted" />
            <div className="w-full h-5 rounded-full bg-muted" />
            <div className="w-3/4 h-5 rounded-full bg-muted" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1.5">
              <div className="w-28 h-4 rounded-full bg-muted" />
              <div className="w-20 h-3 rounded-full bg-muted" />
            </div>
            <div className="w-10 h-10 rounded-full bg-muted" />
          </div>
        </div>

        {/* Wisdom section */}
        <div className="mb-10 space-y-3">
          <div className="w-16 h-4 rounded-full bg-muted" />
          <div className="w-full h-4 rounded-full bg-muted" />
          <div className="w-full h-4 rounded-full bg-muted" />
          <div className="w-2/3 h-4 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  )
}
