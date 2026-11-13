export default function Loading() {
  return (
    <main
      dir="rtl"
      role="status"
      aria-busy="true"
      aria-label="جارٍ تحميل الصفحة"
      className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8"
    >
      <span className="sr-only">جارٍ تحميل الصفحة...</span>
      <div aria-hidden="true" className="mx-auto w-full max-w-7xl animate-pulse space-y-6">
        <div className="h-10 w-48 rounded-lg bg-slate-200" />
        <div className="h-5 w-72 max-w-full rounded bg-slate-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-32 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="h-4 w-24 rounded bg-slate-200" />
              <div className="mt-5 h-8 w-32 max-w-full rounded bg-slate-200" />
            </div>
          ))}
        </div>
        <div className="h-64 rounded-2xl border border-slate-200 bg-white" />
      </div>
    </main>
  );
}
