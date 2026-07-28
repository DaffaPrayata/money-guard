"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Input } from "@/components/money/input"
import { Button } from "@/components/money/button"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Kirim request login ke Laravel Backend
      const response = await api.post('/login', { email, password });

      if (response.data.success) {
        // 2. Simpan token Sanctum ke localStorage
        localStorage.setItem('token', response.data.token);
        
        // 3. Simpan data user singkat jika diperlukan
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // 4. Redirect ke Dashboard
        router.push('/dashboard');
      }
    } catch (err: any) {
      // Tangani error jika email/password salah
      const message = err.response?.data?.message || 'Gagal login. Cek kembali akun kamu.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-[320px] flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-[28px] font-bold text-[#1e3a5f] mb-2">Money Guard</h1>
          <p className="text-sm text-[#737373]">Track your money, achieve your goals</p>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <p className="text-xs text-[#737373] text-center">
          Don&apos;t have an account?{" "}
          <button className="text-[#1e3a5f] font-medium hover:underline">
            Sign up
          </button>
        </p>
      </form>
    </main>
  )
}
