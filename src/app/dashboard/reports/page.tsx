'use client';

import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div dir="rtl" className="mx-auto max-w-5xl space-y-8">
      <div>
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
          التحليلات ومؤشرات الأداء
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          التقارير المالية والأهداف
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          تحليل الإيرادات، وتتبع مدى تحقيق المستهدفات والنمو.
        </p>
      </div>
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
          <BarChart3 aria-hidden="true" className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          هذه الصفحة قيد التطوير
        </h2>
        <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          سيتم عرض الرسوم البيانية ومؤشرات الأداء المالي والأهداف المستهدفة هنا قريباً.
        </p>
      </div>
    </div>
  );
}
