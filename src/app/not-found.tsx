import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'الصفحة غير موجودة | بيت التمكين',
  description: 'تعذر العثور على الصفحة المطلوبة.',
};

export default function NotFound() {
  return (
    <main
      dir="rtl"
      className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-12 text-center"
    >
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold tracking-widest text-indigo-800">404</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">الصفحة غير موجودة</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          قد يكون الرابط غير صحيح أو أن الصفحة نُقلت.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-indigo-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
        >
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    </main>
  );
}
