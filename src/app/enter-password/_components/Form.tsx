"use client"
// Next
import { useRouter } from "next/navigation";
// React
import { useState } from "react";

export default function Form() {
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const router = useRouter();

    const from = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('from') || '/protected' : '/protected';

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!password) return
        try {
            const res = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: password, from }),
            });
            if (res.ok) {
                setError('')
                setSuccess('Success! Redirecting...');
                const body = await res.json();
                router.push(body.from || '/protected');
            } else if (res.status === 401) {
                setError('Incorrect password');
            } else {
                setError('Login failed');
            }
        } catch (error) {
            console.error(error);
            setError('Network error');
        }
    }
  return (
    <>
        <form onSubmit={submit} className="bg-black py-6 px-10 max-w-80 rounded-2xl">
            <h1 className="mb-4 font-bold">Enter Password</h1>
            <div className="mb-8">
                <label htmlFor="password">Password:</label>
                  <input
                      type="password"
                      name="password"
                      id="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="bg-white rounded px-2 py-1 w-full"
                  />
            </div>
            <div>
                <button type="submit" className="cursor-pointer rounded px-4 py-1.5 w-full bg-blue-900 hover:bg-blue-400 transition-colors duration-600">Enter</button>
            </div>
        </form>
        {error && <div className="text-red-500 mt-4">{error}</div>}
        {success && <div className="text-green-500 mt-4">{success}</div>}
    </>
  )
}