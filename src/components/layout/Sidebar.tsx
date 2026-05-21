'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationItems } from '@/constants/navigation';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#195440] min-h-screen flex flex-col fixed left-0 top-0 bottom-0 overflow-y-auto z-40">
      <div className="p-6 border-b border-[#2d7a5f]">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
          <div className="text-white">
            <div className="font-semibold">Admin Panel</div>
            <div className="text-xs text-gray-300">Super Admin</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#E1B047] text-white'
                      : 'text-gray-200 hover:bg-[#E1B047]/20 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
