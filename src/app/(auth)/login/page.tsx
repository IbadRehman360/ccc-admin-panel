'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLoginMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { setTokens } from '@/lib/api/client';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await login({ email, password }).unwrap();
      setTokens(result.access_token, result.refresh_token);
      dispatch(setCredentials({ admin: result.admin }));
      router.push('/dashboard');
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string | string[] } })?.data?.message;
      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message || 'Login failed. Check your credentials.',
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/login-bg.png)' }}
      >
        <div className="absolute inset-0 bg-[#195440]/40"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-md shadow-2xl rounded-[40px] p-[32px] mx-[-80px] my-[0px] bg-[#222222]/40">
          <div className="flex justify-center mb-6">
            <img src="/assets/logo.png" alt="Logo" className="w-32 h-32 object-contain" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-white/80">Sign in to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-[#E1B047] focus:ring-[#E1B047]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-white/20 border-transparent text-white placeholder:text-white/60 focus:border-[#E1B047] focus:ring-[#E1B047]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label htmlFor="remember" className="text-sm text-white/80 cursor-pointer">
                  Remember me
                </label>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-500/20 border border-red-400/40 px-3 py-2 text-sm text-red-100">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E1B047] hover:bg-[#195440] disabled:opacity-60"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/20 text-center">
            <span className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium">
              Super Admin Access
            </span>
          </div>
        </div>

        <div className="text-center mt-6 text-white text-sm">
          <p>© 2026 Admin Panel. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
