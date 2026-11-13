'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export type ErrorFallbackProps = Readonly<{
  title?: string;
  message?: string;
  digest?: string;
  onRetry?: () => void;
  className?: string;
}>;

const WHATSAPP_SUPPORT_NUMBER = '967779030679';
const SUPPORT_GREETING = 'مرحباً قسم التقنية والتطوير، واجهتني المشكلة التالية في التطبيق...';

export function ErrorFallback({
  title = 'حدث خطأ غير متوقع',
  message = 'لم نتمكن من تحميل هذه الصفحة حالياً. يمكنك محاولة إعادة التحميل.',
  digest,
  onRetry,
  className,
}: ErrorFallbackProps) {
  const supportLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!supportLinkRef.current) return;

    const supportMessage = [
      SUPPORT_GREETING,
      `رمز الخطأ: ${digest || 'غير متوفر'}`,
      `رابط الصفحة: ${window.location.href}`,
    ].join('\n');
    supportLinkRef.current.href = `https://wa.me/${WHATSAPP_SUPPORT_NUMBER}?text=${encodeURIComponent(supportMessage)}`;
  }, [digest]);

  return (
    <main
      dir="rtl"
      role="alert"
      className={cn(
        'flex min-h-[60vh] flex-col items-center justify-center px-6 py-12 text-center',
        className,
      )}
    >
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">تعذر إكمال طلبك</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{message}</p>
        {digest && (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            رقم المرجع:{' '}
            <code dir="ltr" className="rounded bg-slate-100 px-1.5 py-0.5 font-mono dark:bg-slate-800">
              {digest}
            </code>
          </p>
        )}
        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-xl bg-indigo-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              إعادة المحاولة
            </button>
          )}
          <a
            ref={supportLinkRef}
            href={`https://wa.me/${WHATSAPP_SUPPORT_NUMBER}?text=${encodeURIComponent(SUPPORT_GREETING)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="التواصل مع قسم التقنية والتطوير عبر واتساب، يفتح في تبويب جديد"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M20.52 3.48A11.83 11.83 0 0 0 12.08 0C5.5 0 .15 5.34.15 11.92c0 2.1.55 4.15 1.59 5.96L.05 24l6.27-1.64a11.9 11.9 0 0 0 5.76 1.47h.01c6.57 0 11.92-5.35 11.92-11.92 0-3.19-1.24-6.18-3.49-8.43ZM12.09 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.98.99-3.63-.23-.37a9.88 9.88 0 0 1-1.52-5.27c0-5.46 4.45-9.9 9.9-9.9a9.83 9.83 0 0 1 7 2.9 9.83 9.83 0 0 1 2.9 7c0 5.46-4.45 9.9-9.91 9.9Zm5.43-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
            </svg>
            التواصل عبر واتساب
          </a>
        </div>
      </div>
    </main>
  );
}

export default ErrorFallback;
