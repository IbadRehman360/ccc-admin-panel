'use client';

import { Search, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserAvatar } from './UserAvatar';
import { useLogoutMutation } from '@/store/api/authApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCredentials } from '@/store/slices/authSlice';
import { getRefreshToken, clearTokens } from '@/lib/api/client';

export function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const admin = useAppSelector((s) => s.auth.admin);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    const refresh_token = getRefreshToken();
    if (refresh_token) {
      try {
        await logout({ refresh_token }).unwrap();
      } catch {
        // ignore — clear local state regardless
      }
    }
    clearTokens();
    dispatch(clearCredentials());
    router.replace('/login');
  };

  const displayName = admin?.full_name || admin?.email || 'Admin User';
  const displayRole = admin?.user_type === 'ADMIN' ? 'Super Admin' : 'Admin';

  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search users, businesses, communities..."
              className="pl-10 bg-gray-50"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
            <UserAvatar name={displayName} size="sm" />
            <div className="text-sm">
              <div className="font-medium">{displayName}</div>
              <div className="text-xs text-gray-500">{displayRole}</div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
