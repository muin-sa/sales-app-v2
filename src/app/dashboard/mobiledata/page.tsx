'use client';

import { Smartphone } from 'lucide-react';

export default function MobileDataPage() {
  return (
    <div dir="rtl" className="mx-auto max-w-5xl space-y-8">
      <div>
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
          إدارة الاتصالات والبيانات
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          بيانات الاتصال والتصدير
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          إدارة جهات الاتصال واستخراج التقارير بصيغة CSV.
        </p>
      </div>
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
          <Smartphone aria-hidden="true" className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          هذه الصفحة قيد التطوير
        </h2>
        <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          سيتم إضافة أدوات تصدير وسجلات الاتصالات وأجهزة التطبيق هنا قريباً.
        </p>
      </div>
    </div>
  );
}
