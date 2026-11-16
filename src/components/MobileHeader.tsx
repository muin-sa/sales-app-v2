'use client';

import Image from 'next/image';
import { Menu } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

export const DASHBOARD_SIDEBAR_ID = 'dashboard-sidebar';

type MobileHeaderProps = Readonly<{
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}>;

export default function MobileHeader({ isOpen, setIsOpen }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-900/95">
      <button
        type="button"
        aria-label={isOpen ? 'إغلاق قائمة التنقل' : 'فتح قائمة التنقل'}
        aria-expanded={isOpen}
        aria-controls={DASHBOARD_SIDEBAR_ID}
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <Menu aria-hidden="true" className="h-5 w-5" />
      </button>
      <div className="flex min-w-0 items-center gap-3 space-x-reverse">
        <Image
          src="/bayt-tamkeen-logo.jpg"
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 shrink-0 rounded-full bg-white object-contain ring-1 ring-slate-200"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">بيت التمكين</p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">منصة المبيعات</p>
        </div>
      </div>
    </header>
  );
}
