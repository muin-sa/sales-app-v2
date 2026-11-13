'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode, TouchEvent } from 'react';
import Sidebar from '@/components/Sidebar';
import MobileHeader from '@/components/MobileHeader';

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!isSidebarOpen) return;

    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const originalOverflow = document.body.style.overflow;
    const updateScrollLock = (): void => {
      document.body.style.overflow = mobileQuery.matches ? 'hidden' : originalOverflow;
    };
    const handleBreakpointChange = (): void => {
      updateScrollLock();
      if (!mobileQuery.matches) setIsSidebarOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && mobileQuery.matches) setIsSidebarOpen(false);
    };

    updateScrollLock();
    window.addEventListener('keydown', handleKeyDown);
    mobileQuery.addEventListener('change', handleBreakpointChange);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      mobileQuery.removeEventListener('change', handleBreakpointChange);
    };
  }, [isSidebarOpen]);

  function handleBackdropTouchStart(event: TouchEvent<HTMLButtonElement>): void {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  }

  function handleBackdropTouchEnd(event: TouchEvent<HTMLButtonElement>): void {
    const endX = event.changedTouches[0]?.clientX;
    if (touchStartX.current !== null && endX !== undefined && Math.abs(endX - touchStartX.current) > 48) {
      setIsSidebarOpen(false);
    }
    touchStartX.current = null;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MobileHeader isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <button
        type="button"
        aria-label="إغلاق قائمة التنقل"
        aria-hidden={!isSidebarOpen}
        tabIndex={isSidebarOpen ? 0 : -1}
        onClick={() => setIsSidebarOpen(false)}
        onTouchStart={handleBackdropTouchStart}
        onTouchEnd={handleBackdropTouchEnd}
        className={`fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0'
        }`}
      />
      <div className="flex min-h-screen">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className="min-w-0 flex-1 p-4 text-slate-900 dark:text-slate-100 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
