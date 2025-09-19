"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const signUp = async (email: string, password: string, name: string) => {
  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  });

  return result;
};

export const signIn = async (email: string, password: string) => {
  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });
  return result;
};

export const signInSocial = async (provider: "github" | "google") => {
  const { url } = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: "/analytics-dashboard",
    },
  });

  if (url) {
    redirect(url);
  }
};

export const signOut = async () => {
  const result = await auth.api.signOut({ headers: await headers() });
  return result;
};

export async function logoutAction() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch (err: any) {
    console.error("Sign out error:", err);
    // fallthrough to redirect anyway
  }
  // redirect on server after sign out
  redirect("/login");
}