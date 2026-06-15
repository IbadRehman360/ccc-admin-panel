'use client';

import { LogOut, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserAvatar } from './UserAvatar';
import { useLogoutMutation } from '@/store/api/authApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCredentials } from '@/store/slices/authSlice';
import {
  getRefreshToken,
  clearTokens,
  API_URL,
} from '@/lib/api/client';

// Strip /api/v1 from the API URL so we can build /api/v1/docs ourselves
const docsUrl = `${API_URL.replace(/\/api\/v1\/?$/, '')}/api/v1/docs`;

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

  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-50">
      <div className="h-full px-6 flex items-center justify-end gap-4">
        <a
          href={docsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#195440] px-3 py-2 rounded-md hover:bg-gray-50"
          title="Open Swagger API docs in new tab"
        >
          <FileText className="w-4 h-4" />
          API Docs
        </a>

        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
          <UserAvatar name={displayName} size="sm" />
          <div className="text-sm">
            <div className="font-medium leading-tight">{displayName}</div>
            <div className="text-xs text-gray-500">Admin</div>
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
    </header>
  );
}
