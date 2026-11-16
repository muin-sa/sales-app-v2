'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import type { Dispatch, SetStateAction, TouchEvent } from 'react';
import {
  LayoutDashboard,
  Building2,
  Target,
  ClipboardList,
  Bell,
  ListTodo,
  Smartphone,
  ShieldCheck,
  History,
  Settings,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DASHBOARD_SIDEBAR_ID } from '@/components/MobileHeader';

type NavigationItem = Readonly<{
  href: string;
  label: string;
  icon: LucideIcon;
}>;

// عناصر التنقل متوافقة مع مسارات التطبيق الحالية.
const navigationItems: NavigationItem[] = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/dashboard/associations', label: 'الجمعيات', icon: Building2 },
  { href: '/dashboard/revenues', label: 'الإيرادات والمستهدفات', icon: Target },
  { href: '/dashboard/requests', label: 'مركز الطلبات', icon: ClipboardList },
  { href: '/dashboard/followups', label: 'العلاقات والمتابعة', icon: Bell },
  { href: '/dashboard/planner', label: 'الخطط', icon: ListTodo },
  { href: '/dashboard/mobiledata', label: 'الجوالات والداتا', icon: Smartphone },
  { href: '/dashboard/licenses', label: 'التراخيص والأصول', icon: ShieldCheck },
  { href: '/dashboard/auditlog', label: 'سجل العمليات', icon: History },
  { href: '/dashboard/settings', label: 'الإعدادات', icon: Settings },
];

type SidebarProps = Readonly<{
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}>;

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  useEffect(() => {
    if (!isOpen || !sidebarRef.current) return;

    const sidebar = sidebarRef.current;
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const closeButton = sidebar.querySelector<HTMLButtonElement>('[data-sidebar-close]');
    const getFocusableElements = (): HTMLElement[] => Array.from(
      sidebar.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );

    closeButton?.focus();

    const trapFocus = (event: KeyboardEvent): void => {
      if (event.key !== 'Tab') return;
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    sidebar.addEventListener('keydown', trapFocus);
    return () => {
      sidebar.removeEventListener('keydown', trapFocus);
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  function handleTouchStart(event: TouchEvent<HTMLElement>): void {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>): void {
    const endX = event.changedTouches[0]?.clientX;
    if (touchStartX.current !== null && endX !== undefined && endX - touchStartX.current > 60) {
      setIsOpen(false);
    }
    touchStartX.current = null;
  }

  return (
    <aside
      ref={sidebarRef}
      id={DASHBOARD_SIDEBAR_ID}
      role={isOpen ? 'dialog' : undefined}
      aria-modal={isOpen ? true : undefined}
      aria-label="قائمة التنقل الرئيسية"
      dir="rtl"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`fixed inset-y-0 right-0 z-50 flex h-dvh w-72 max-w-[85vw] shrink-0 flex-col border-l border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 md:visible md:relative md:h-screen md:w-64 md:max-w-none md:translate-x-0 md:shadow-none ${
        isOpen ? 'visible translate-x-0' : 'invisible translate-x-full'
      }`}
    >
      <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 px-4 dark:border-slate-800">
        <Link
          href="/dashboard"
          onClick={() => setIsOpen(false)}
          className="flex min-w-0 items-center space-x-3 space-x-reverse"
        >
          <Image
            src="/bayt-tamkeen-logo.jpg"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full bg-white object-contain ring-1 ring-slate-200"
          />
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-bold text-slate-900 dark:text-white">بيت التمكين</span>
            <span className="truncate text-xs text-slate-500 dark:text-slate-400">منصة المبيعات</span>
          </span>
        </Link>
        <button
          type="button"
          data-sidebar-close
          aria-label="إغلاق قائمة التنقل"
          onClick={() => setIsOpen(false)}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <nav aria-label="التنقل الرئيسي" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navigationItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/dashboard'
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center rounded-xl px-3 py-3 text-sm transition-colors space-x-3 space-x-reverse ${
                isActive
                  ? 'bg-indigo-50 font-semibold text-indigo-950 dark:bg-indigo-950/50 dark:text-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-slate-100 p-4 dark:border-slate-800">
        <div className="flex items-center space-x-3 space-x-reverse">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200" aria-hidden="true">
            م
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">محمد أحمد</span>
            <span className="truncate text-xs text-slate-500 dark:text-slate-400">مدير المبيعات</span>
          </span>
        </div>
      </div>
    </aside>
    );
}
