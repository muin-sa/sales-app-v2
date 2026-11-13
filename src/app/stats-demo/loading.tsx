export default function StatsDemoLoading() {
  return (
    <main
      dir="rtl"
      role="status"
      aria-busy="true"
      aria-label="جارٍ تحميل الإحصاءات"
      className="flex min-h-screen items-center justify-center bg-slate-50 p-6 md:p-12"
    >
      <span className="sr-only">جارٍ تحميل الإحصاءات...</span>
      <div
        aria-hidden="true"
        className="w-full max-w-6xl animate-pulse rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm"
      >
        <div className="mx-auto h-7 w-48 rounded bg-slate-200" />
        <div className="mx-auto mt-3 h-4 w-72 max-w-full rounded bg-slate-100" />
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="space-y-4">
              <div className="h-4 w-24 rounded bg-slate-200" />
              <div className="h-10 w-32 max-w-full rounded bg-slate-200" />
              <div className="h-3 w-full rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
