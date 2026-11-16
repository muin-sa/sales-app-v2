import type { Metadata } from "next";
import Image from "next/image";
import SignInForm from "./SignInForm";

export const metadata: Metadata = {
  title: "تسجيل الدخول | بيت التمكين",
};

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080d19] px-4 py-10 text-white sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_18%,rgba(34,211,238,0.17),transparent_36%),radial-gradient(ellipse_at_82%_72%,rgba(163,230,53,0.12),transparent_38%)]"
      />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-600 bg-[#0c1424] shadow-[0_30px_120px_rgba(0,0,0,0.5)] md:grid-cols-2">
        <section
          aria-labelledby="signin-title"
          className="px-6 py-9 sm:px-10 sm:py-12 lg:px-14"
        >
          <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-slate-600 bg-slate-900/80 px-4 py-2">
            <Image
              src="/bayt-tamkeen-logo.jpg"
              alt=""
              width={48}
              height={48}
              priority
              className="h-12 w-12 rounded-full bg-white object-contain"
            />
            <span>
              <span className="block text-sm font-bold text-white">
                بيت التمكين
              </span>
              <span className="block text-xs text-slate-300">
                منصة عمليات المبيعات
              </span>
            </span>
          </div>

          <h1
            id="signin-title"
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            مرحباً بعودتك
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-7 text-slate-300">
            سجّل الدخول لمتابعة لوحة بيت التمكين ومعلومات حسابك المحفوظة بأمان.
          </p>

          <SignInForm />
        </section>

        <aside
          aria-labelledby="neon-panel-title"
          className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden border-r border-slate-700 bg-[#101b2d] p-10 md:flex lg:p-14"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 top-12 h-72 w-72 rounded-full bg-cyan-400/20 blur-[100px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-10 h-80 w-80 rounded-full bg-lime-300/15 blur-[110px]"
          />

          <div className="relative">
            <p className="text-xs font-bold tracking-[0.2em] text-cyan-200">
              بياناتك، بهدوء وموثوقية
            </p>
            <h2
              id="neon-panel-title"
              className="mt-5 max-w-sm text-3xl font-bold leading-relaxed text-white"
            >
              هويتك وجلساتك على Neon
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
              يستخدم تسجيل الدخول Neon Auth لإدارة حسابك وجلسة آمنة متصلة
              بقاعدة بيانات التطبيق.
            </p>
          </div>

          <div className="relative rounded-2xl border border-slate-600 bg-slate-950/50 p-5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full bg-lime-300 shadow-[0_0_18px_rgba(190,242,100,0.9)]"
              />
              <p className="text-sm font-semibold text-slate-100">
                جلسة موثقة عبر Neon Auth
              </p>
            </div>
            <p className="mt-3 text-xs leading-6 text-slate-300">
              بيانات الدخول لا تُعرض في الصفحة أو تُحفظ محلياً.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
