import DataTable from '@/components/DataTable';
import DonationsTable from '@/components/DonationsTable';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">نظرة عامة</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">لوحة المبيعات</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          تابع طلبات المبيعات وسندات التبرع المسجلة في قاعدة البيانات.
        </p>
      </header>
      <DataTable />
      <DonationsTable />
    </div>
  );
}
