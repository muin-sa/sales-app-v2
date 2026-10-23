import StatsBandDemo from "@/components/ui/stats-band-demo";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8">
        <StatsBandDemo />
      </div>
    </div>
  );
}
