"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { signUpWithEmail } from "./actions";

type CurrentUser = {
  name: string;
  email: string;
};

export default function SignUpForm({
  currentUser,
}: {
  currentUser: CurrentUser | null;
}) {
  const [state, formAction, isPending] = useActionState(signUpWithEmail, null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const brand = (
    <div className="mb-6 flex items-center gap-3">
      <Image
        src="/bayt-tamkeen-logo.jpg"
        alt=""
        width={48}
        height={48}
        className="h-12 w-12 rounded-full bg-white object-contain ring-1 ring-slate-200"
      />
      <div>
        <p className="font-bold text-slate-900">بيت التمكين</p>
        <p className="text-sm text-slate-600">منصة عمليات المبيعات</p>
      </div>
    </div>
  );

  useEffect(() => {
    if (state?.error) errorRef.current?.focus();
    if (currentUser) headingRef.current?.focus();
  }, [currentUser, state]);

  if (currentUser) {
    return (
      <section
        aria-labelledby="signup-title"
        className="w-full max-w-md rounded-2xl border border-slate-300 bg-white p-6 shadow-sm sm:p-8"
      >
        {brand}
        <h1
          ref={headingRef}
          id="signup-title"
          tabIndex={-1}
          className="text-2xl font-bold text-slate-900"
        >
          تم إنشاء الحساب
        </h1>
        <p role="status" className="mt-4 text-slate-700">
          أنت مسجل الدخول باسم {currentUser.name} ({currentUser.email}).
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="signup-title"
      className="w-full max-w-md rounded-2xl border border-slate-300 bg-white p-6 shadow-sm sm:p-8"
    >
      {brand}
      <h1 id="signup-title" className="text-2xl font-bold text-slate-900">
        إنشاء حساب
      </h1>
      <p className="mt-2 text-sm text-slate-700">
        أدخل بياناتك لإنشاء حساب جديد.
      </p>

      <form action={formAction} className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="signup-name"
            className="mb-1.5 block text-sm font-medium text-slate-800"
          >
            الاسم
          </label>
          <input
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="w-full rounded-lg border border-slate-500 bg-white px-3 py-2.5 text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
          />
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="mb-1.5 block text-sm font-medium text-slate-800"
          >
            البريد الإلكتروني
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            dir="ltr"
            className="w-full rounded-lg border border-slate-500 bg-white px-3 py-2.5 text-left text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
          />
        </div>

        <div>
          <label
            htmlFor="signup-password"
            className="mb-1.5 block text-sm font-medium text-slate-800"
          >
            كلمة المرور
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            dir="ltr"
            className="w-full rounded-lg border border-slate-500 bg-white px-3 py-2.5 text-left text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
          />
        </div>

        {state?.error && (
          <p
            ref={errorRef}
            id="signup-error"
            role="alert"
            tabIndex={-1}
            className="rounded-lg border border-red-800 bg-red-50 px-3 py-2 text-sm text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
          >
            {state.error}
          </p>
        )}

        <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {isPending ? "جارٍ إنشاء الحساب..." : ""}
        </p>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-indigo-900 px-4 py-3 font-semibold text-white hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-700">
        لديك حساب؟{" "}
        <Link
          href="/auth/sign-in"
          className="font-semibold text-indigo-800 underline underline-offset-4 hover:text-indigo-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-700"
        >
          تسجيل الدخول
        </Link>
      </p>
    </section>
  );
}
