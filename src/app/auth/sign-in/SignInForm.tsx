"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import type { FormEvent } from "react";
import { authClient } from "@/lib/auth/client";

function isClientErrorResponse(error: unknown): error is { status: number } {
  if (typeof error !== "object" || error === null || !("status" in error)) {
    return false;
  }

  return (
    typeof error.status === "number" &&
    error.status >= 400 &&
    error.status < 500
  );
}

export default function SignInForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const submissionInProgress = useRef(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionInProgress.current) return;

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      setErrorMessage("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    submissionInProgress.current = true;
    setErrorMessage("");

    startTransition(async () => {
      try {
        const { error } = await authClient.signIn.email({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMessage(
            "تعذر تسجيل الدخول. تحقق من بياناتك ثم أعد المحاولة.",
          );
          return;
        }

        window.sessionStorage.setItem("focus-dashboard-after-sign-in", "true");
        router.replace("/");
      } catch (error) {
        if (isClientErrorResponse(error)) {
          setErrorMessage(
            "تعذر تسجيل الدخول. تحقق من بياناتك ثم أعد المحاولة.",
          );
          return;
        }

        if (!(error instanceof Error)) throw error;
        setErrorMessage(
          "تعذر الاتصال بخدمة تسجيل الدخول. تحقق من اتصالك ثم أعد المحاولة.",
        );
      } finally {
        submissionInProgress.current = false;
      }
    });
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        aria-busy={isPending}
        className="mt-8 space-y-5"
      >
        <div>
          <label
            htmlFor="signin-email"
            className="mb-2 block text-sm font-semibold text-slate-100"
          >
            البريد الإلكتروني
          </label>
          <input
            id="signin-email"
            name="email"
            type="email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            dir="ltr"
            required
            className="min-h-12 w-full rounded-xl border border-slate-500 bg-[#111c2f] px-4 py-3 text-left text-white placeholder:text-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
            placeholder="name@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="signin-password"
            className="mb-2 block text-sm font-semibold text-slate-100"
          >
            كلمة المرور
          </label>
          <input
            id="signin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            dir="ltr"
            required
            className="min-h-12 w-full rounded-xl border border-slate-500 bg-[#111c2f] px-4 py-3 text-left text-white placeholder:text-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
            placeholder="••••••••"
          />
        </div>

        <p
          id="signin-error"
          role="alert"
          className={`rounded-lg border border-red-300 bg-red-950/70 px-3 py-2 text-sm leading-6 text-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 ${
            errorMessage ? "" : "sr-only"
          }`}
        >
          {errorMessage}
        </p>

        <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {isPending ? "جارٍ تسجيل الدخول..." : ""}
        </p>

        <button
          type="submit"
          aria-disabled={isPending}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-lime-300 px-4 py-3 font-bold text-slate-950 transition-colors hover:bg-lime-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200 aria-disabled:cursor-wait aria-disabled:opacity-80"
        >
          {isPending && (
            <LoaderCircle
              aria-hidden="true"
              className="h-4 w-4 motion-safe:animate-spin"
            />
          )}
          <span>تسجيل الدخول</span>
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-300">
        ليس لديك حساب؟{" "}
        <Link
          href="/auth/sign-up"
          className="font-bold text-lime-300 underline decoration-lime-300 underline-offset-4 hover:text-lime-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300"
        >
          إنشاء حساب
        </Link>
      </p>
    </>
  );
}
