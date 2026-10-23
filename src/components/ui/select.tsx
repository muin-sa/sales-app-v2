"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Composable Select Context
// ─────────────────────────────────────────────
interface SelectContextType {
  value: string;
  onValueChange?: (val: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedLabel: string;
  setSelectedLabel: (label: string) => void;
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined);

export interface ComposableSelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
}

export interface NativeSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon?: React.ReactNode;
  onValueChange?: (val: string) => void;
}

// Unified Select: supports both composable (shadcn-style) and native select
export function Select(props: ComposableSelectProps | NativeSelectProps) {
  // If onValueChange is provided or it doesn't have standard select attributes like onChange with HTMLSelectElement
  const isComposable = "onValueChange" in props || !("onChange" in props);

  if (isComposable) {
    return <ComposableSelect {...(props as ComposableSelectProps)} />;
  }

  return <NativeSelect {...(props as NativeSelectProps)} />;
}

function ComposableSelect({
  value = "",
  defaultValue = "",
  onValueChange,
  children,
}: ComposableSelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || value);
  const [open, setOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState("");

  const actualValue = value !== undefined && value !== "" ? value : internalValue;

  const handleValueChange = (newVal: string) => {
    setInternalValue(newVal);
    onValueChange?.(newVal);
    setOpen(false);
  };

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <SelectContext.Provider
      value={{
        value: actualValue,
        onValueChange: handleValueChange,
        open,
        setOpen,
        selectedLabel,
        setSelectedLabel,
      }}
    >
      <div ref={containerRef} className="relative inline-block w-full">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectTrigger must be used within Select");

  return (
    <button
      type="button"
      onClick={() => ctx.setOpen(!ctx.open)}
      className={cn(
        "flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 shadow-2xs transition-all focus:outline-none focus:ring-2 focus:ring-purple-900",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-1.5 truncate">{children}</span>
      <ChevronDown
        className={cn(
          "h-4 w-4 text-slate-400 transition-transform duration-200 stroke-[2.2] shrink-0",
          ctx.open && "rotate-180"
        )}
      />
    </button>
  );
}

export function SelectValue({
  placeholder,
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectValue must be used within Select");

  return (
    <span className={cn("truncate text-sm font-medium", className)}>
      {ctx.selectedLabel || placeholder || ""}
    </span>
  );
}

export function SelectContent({
  className,
  children,
  dir = "rtl",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { dir?: string }) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectContent must be used within Select");

  if (!ctx.open) return null;

  return (
    <div
      dir={dir}
      className={cn(
        "absolute right-0 top-full z-50 mt-1 max-h-60 w-full min-w-[8rem] overflow-auto rounded-xl border border-slate-200 bg-white p-1 text-slate-900 shadow-xl animate-in fade-in-0 zoom-in-95 duration-150",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectItem({
  value,
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectItem must be used within Select");

  const isSelected = ctx.value === value;

  React.useEffect(() => {
    if (isSelected && typeof children === "string") {
      ctx.setSelectedLabel(children);
    }
  }, [isSelected, children, ctx]);

  return (
    <div
      onClick={() => {
        ctx.onValueChange?.(value);
        if (typeof children === "string") {
          ctx.setSelectedLabel(children);
        }
      }}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-100 hover:text-slate-900 transition-colors",
        isSelected && "bg-purple-50 text-purple-900 font-bold",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      {isSelected && <Check className="h-3.5 w-3.5 text-purple-900" />}
    </div>
  );
}

// ─────────────────────────────────────────────
// Native Select (Backward Compatible)
// ─────────────────────────────────────────────
export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, children, icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <select
          ref={ref}
          className={cn(
            "flex h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2 pl-9 text-sm text-slate-700 shadow-2xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-900 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer font-medium",
            icon && "pr-10",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none stroke-[2.2]" />
      </div>
    );
  }
);
NativeSelect.displayName = "NativeSelect";
