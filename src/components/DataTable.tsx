'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { DashboardRequestRecord, RequestStatus } from '@/types/dashboard';

export type SaleStatus = RequestStatus;
export type SaleRecord = DashboardRequestRecord;

const statusLabels: Record<SaleStatus, string> = {
  in_progress: 'قيد التنفيذ',
  awaiting_supervisor: 'بانتظار المشرف',
  completed: 'مكتمل',
  closed: 'مغلق',
};

const statusStyles: Record<SaleStatus, string> = {
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-400/20',
  in_progress: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-400/20',
  awaiting_supervisor: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-400/20',
  closed: 'bg-slate-100 text-slate-700 ring-slate-600/20 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-400/20',
};

function isSaleRecord(value: unknown): value is SaleRecord {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.referenceNumber === 'string'
    && typeof record.associationName === 'string'
    && typeof record.title === 'string'
    && typeof record.requestDate === 'string'
    && typeof record.amount === 'number'
    && (record.status === 'in_progress'
      || record.status === 'awaiting_supervisor'
      || record.status === 'completed'
      || record.status === 'closed');
}

const currencyFormatter = new Intl.NumberFormat('ar-SA', {
  style: 'currency',
  currency: 'SAR',
  maximumFractionDigits: 0,
});

export default function DataTable() {
  const [query, setQuery] = useState('');
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSales(): Promise<void> {
      try {
        const response = await fetch('/api/dashboard/requests', { signal: controller.signal });
        const payload: unknown = await response.json();
        if (!response.ok) {
          const message = typeof payload === 'object' && payload !== null && 'error' in payload && typeof payload.error === 'string'
            ? payload.error
            : 'تعذر تحميل بيانات الطلبات.';
          throw new Error(message);
        }
        if (!Array.isArray(payload) || !payload.every(isSaleRecord)) {
          throw new Error('استجابة بيانات الطلبات غير صالحة.');
        }
        setSales(payload);
        setLoadError(null);
      } catch (error: unknown) {
        if (controller.signal.aborted) return;
        setLoadError(error instanceof Error ? error.message : 'حدث خطأ أثناء تحميل الطلبات.');
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadSales();
    return () => controller.abort();
  }, [reloadKey]);

  const filteredSales = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ar');
    if (!normalizedQuery) return sales;

    return sales.filter((sale) =>
      [sale.associationName, sale.title, sale.referenceNumber].some((value) =>
        value.toLocaleLowerCase('ar').includes(normalizedQuery),
      ),
    );
  }, [query, sales]);

  function retryLoading(): void {
    setIsLoading(true);
    setLoadError(null);
    setReloadKey((key) => key + 1);
  }

  return (
    <section aria-labelledby="sales-title" dir="rtl" className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="sales-title" className="text-lg font-bold text-slate-900 dark:text-white">أحدث طلبات المبيعات</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">طلبات سندات التبرع المسجلة في قاعدة البيانات</p>
        </div>
        <label className="relative block w-full sm:max-w-xs">
          <span className="sr-only">ابحث باسم الجمعية أو الطلب أو الرقم المرجعي</span>
          <Search aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ابحث في المبيعات..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-10 pl-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-right text-sm">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-500 dark:bg-slate-800/60 dark:text-slate-300">
            <tr>
              <th scope="col" className="px-5 py-3">رقم الطلب</th>
              <th scope="col" className="px-5 py-3">الجمعية</th>
              <th scope="col" className="px-5 py-3">الطلب</th>
              <th scope="col" className="px-5 py-3">التاريخ</th>
              <th scope="col" className="px-5 py-3">المبلغ</th>
              <th scope="col" className="px-5 py-3">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400">جارٍ تحميل الطلبات...</td></tr>
            )}
            {!isLoading && loadError && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-rose-700 dark:text-rose-300">
                  <p role="alert">{loadError}</p>
                  <button type="button" onClick={retryLoading} className="mt-3 rounded-lg px-3 py-2 font-semibold text-indigo-800 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-indigo-300">
                    إعادة المحاولة
                  </button>
                </td>
              </tr>
            )}
            {!isLoading && !loadError && filteredSales.map((sale) => (
              <tr key={sale.referenceNumber} className="text-slate-700 transition-colors hover:bg-slate-50/70 dark:text-slate-200 dark:hover:bg-slate-800/40">
                <td dir="ltr" className="px-5 py-4 text-right font-medium text-slate-900 dark:text-white">{sale.referenceNumber}</td>
                <td className="whitespace-nowrap px-5 py-4">{sale.associationName}</td>
                <td className="whitespace-nowrap px-5 py-4">{sale.title}</td>
                <td dir="ltr" className="whitespace-nowrap px-5 py-4 text-right">{sale.requestDate}</td>
                <td className="whitespace-nowrap px-5 py-4">{currencyFormatter.format(sale.amount)}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[sale.status]}`}>
                    {statusLabels[sale.status]}
                  </span>
                </td>
              </tr>
            ))}
            {!isLoading && !loadError && filteredSales.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                  لا توجد طلبات تطابق بحثك.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400" aria-live="polite">
        عدد النتائج: {isLoading || loadError ? 0 : filteredSales.length}
      </p>
    </section>
  );
}
