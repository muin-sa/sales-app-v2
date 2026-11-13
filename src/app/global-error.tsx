'use client';

import { useEffect } from 'react';
import Link from 'next/link';

type GlobalErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Application root error:', error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="m-0 flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <main className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <section role="alert" aria-labelledby="global-error-title">
            <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">تعذر إكمال طلبك</p>
            <h1 id="global-error-title" className="mt-2 text-2xl font-bold">
              عذراً، حدث خطأ في النظام
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              حدثت مشكلة غير متوقعة. يرجى المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.
            </p>
            {error.digest && (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                رقم المرجع:{' '}
                <code dir="ltr" className="rounded bg-slate-100 px-2 py-1 font-mono dark:bg-slate-800">
                  {error.digest}
                </code>
              </p>
            )}
          </section>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="rounded-xl bg-indigo-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              إعادة تحميل الصفحة
            </button>
            <Link
              href="/"
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900"
            >
              العودة للرئيسية
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
