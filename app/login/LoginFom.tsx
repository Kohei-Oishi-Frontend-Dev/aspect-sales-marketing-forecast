'use client'
import React, { useState, useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { login } from './action'

type State = { ok: boolean; message?: string } | null

export default function LoginForm(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [state, formAction, isPending] = useActionState<State, FormData>(
    async (_prev, formData) => login(formData),
    null
  )

  useEffect(() => {
    if (state?.ok) {
      router.push('/')
    }
  }, [state, router])


  return (
    <form action={formAction} className="max-w-md w-full flex flex-col justify-center gap-4 shadow-md rounded-lg p-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center bg-aspect-blue hover:bg-aspect-blue-dark disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md"
      >
        {isPending ? 'Processing...' : 'Login'}
      </button>

      <div aria-live="polite" className="">
        {state?.message && (
          <div className={`text-sm ${state.ok ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </div>
        )}
      </div>
    </form>
  )
}