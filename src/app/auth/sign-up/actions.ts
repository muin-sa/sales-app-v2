"use server";

import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export type SignUpState = { error: string } | null;

export async function signUpWithEmail(
  _previousState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !password
  ) {
    return { error: "يرجى إدخال الاسم والبريد الإلكتروني وكلمة المرور." };
  }

  const { error } = await auth.signUp.email({
    name: name.trim(),
    email: email.trim(),
    password,
  });

  if (error) {
    return { error: error.message || "تعذر إنشاء الحساب. حاول مرة أخرى." };
  }

  redirect("/auth/sign-up");
}
