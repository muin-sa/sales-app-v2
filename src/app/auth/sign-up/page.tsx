import type { Metadata } from "next";
import { auth } from "@/lib/auth/server";
import SignUpForm from "./SignUpForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "إنشاء حساب | بيت التمكين",
};

export default async function SignUpPage() {
  const { data: session, error } = await auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  const currentUser = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
      }
    : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <SignUpForm currentUser={currentUser} />
    </main>
  );
}
