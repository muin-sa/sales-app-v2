'use client';

import { useEffect } from 'react';

type StatsDemoErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function StatsDemoError({ error, reset }: StatsDemoErrorProps) {
  useEffect(() => {
    console.error('Stats demo route error:', error);
  }, [error]);

  return (
    <main
      dir="rtl"
      role="alert"
      className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-12 text-center"
    >
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">تعذر عرض لوحة الإحصاءات</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          حدث خطأ أثناء تحميل العرض التوضيحي. يمكنك إعادة المحاولة.
        </p>
        {error.digest && (
          <p className="mt-3 text-xs text-slate-500">
            رقم المرجع: <span dir="ltr">{error.digest}</span>
          </p>
        )}
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl bg-indigo-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
        >
          إعادة المحاولة
        </button>
      </div>
    </main>
  );
}
