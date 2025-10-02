"use client";
import React, { useActionState, JSX } from "react";
import { signInSocial } from "@/lib/actions/auth-actions"; 
import {MicrosoftIcon} from "./MicrosoftIcon"

type State = { ok: boolean; message?: string } | null;

export default function LoginForm(): JSX.Element {
  const [state, formAction, isPending] = useActionState<State, FormData>(
    async (_prev, formData) => {
      const provider = formData.get("provider") as "github" | "microsoft";
      try {
        // signInSocial returns void; if it doesn't throw, consider it a success
        await signInSocial(provider);
        return { ok: true, message: "Redirecting..." };
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : String(err ?? "Sign in failed");
        return { ok: false, message };
      }
    },
    null
  );

  return (
    <div className="max-w-md w-full flex flex-col justify-center gap-4 shadow-md rounded-lg p-6">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to Aspect Sales & Marketing Dashboard
        </h1>
        <p className="text-gray-600">Sign in with your aspect microsoft account</p>
      </div>

      {/* Microsoft Sign In */}
      <form action={formAction}>
        <input type="hidden" name="provider" value="microsoft" />
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MicrosoftIcon/>
          {isPending ? "Signing in..." : "Continue with Aspect account"}
        </button>
      </form>
      {state?.message && (
        <div
          className={`text-sm text-center p-3 rounded-md ${
            state.ok
              ? "text-green-700 bg-green-50 border border-green-200"
              : "text-red-700 bg-red-50 border border-red-200"
          }`}
        >
          {state.message}
        </div>
      )}
    </div>
  );
}
