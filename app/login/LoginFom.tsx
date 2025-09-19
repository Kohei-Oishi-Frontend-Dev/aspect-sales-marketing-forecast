"use client";
import React, { useActionState, JSX } from "react";
import { useRouter } from "next/navigation";
import { signInSocial } from "@/lib/actions/auth-actions"; 

type State = { ok: boolean; message?: string } | null;

export default function LoginForm(): JSX.Element {
  const router = useRouter();
  
  const [state, formAction, isPending] = useActionState<State, FormData>(
    async (_prev, formData) => {
      const provider = formData.get("provider") as "github" | "microsoft";
      try {
        const result = await signInSocial(provider);
        if (!result) {
          return { ok: false, message: "Sign in failed" };
        }
        
        // Navigate to dashboard on successful sign in
        router.push("/analytics-dashboard");
        return { ok: true, message: "Redirecting..." };
      } catch (err: any) {
        return { ok: false, message: err?.message ?? "Sign in failed" };
      }
    },
    null
  );

  return (
    <div className="max-w-md w-full flex flex-col justify-center gap-4 shadow-md rounded-lg p-6">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to Aspect
        </h1>
        <p className="text-gray-600">Sign in with your preferred provider</p>
      </div>

      {/* Microsoft Sign In */}
      <form action={formAction}>
        <input type="hidden" name="provider" value="microsoft" />
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 23 23">
            <path fill="#f3f3f3" d="M0 0h23v23H0z" />
            <path fill="#f35325" d="M1 1h10v10H1z" />
            <path fill="#81bc06" d="M12 1h10v10H12z" />
            <path fill="#05a6f0" d="M1 12h10v10H1z" />
            <path fill="#ffba08" d="M12 12h10v10H12z" />
          </svg>
          {isPending ? "Signing in..." : "Continue with Microsoft"}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      {/* GitHub Sign In */}
      <form action={formAction}>
        <input type="hidden" name="provider" value="github" />
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
              clipRule="evenodd"
            />
          </svg>
          {isPending ? "Signing in..." : "Continue with GitHub"}
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
