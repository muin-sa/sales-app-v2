"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  overline?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  overline,
  badge,
  actions,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "bg-white border-b border-slate-200/90 px-6 md:px-8 py-6 select-none",
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title Block */}
        <div className="space-y-1">
          {(overline || badge) && (
            <div className="flex items-center gap-2 mb-1">
              {badge}
              {overline && (
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  {overline}
                </span>
              )}
            </div>
          )}
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-[Cairo,sans-serif]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs md:text-sm text-slate-500 max-w-3xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Controls Area */}
        {(actions || children) && (
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {actions}
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
