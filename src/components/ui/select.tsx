'use client';

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectContextType {
  value: string;
  onValueChange: (val: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean;
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined);

export function Select({
  value = "",
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  disabled = false,
  children,
}: {
  value?: string;
  onValueChange?: (val: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: (val) => {
          onValueChange?.(val);
          setOpen(false);
        },
        open,
        setOpen,
        disabled,
      }}
    >
      <div className="relative w-full">{children}</div>
    </SelectContext.Provider>
  );
}

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(SelectContext);

  return (
    <button
      ref={ref}
      type="button"
      disabled={ctx?.disabled}
      onClick={() => ctx && ctx.setOpen(!ctx.open)}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-xs outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

export function SelectValue({
  placeholder,
  children,
}: {
  placeholder?: string;
  children?: React.ReactNode;
}) {
  const ctx = React.useContext(SelectContext);
  const display = children || ctx?.value || placeholder;
  return (
    <span className={cn("truncate text-left flex-1", !children && !ctx?.value && "text-slate-400")}>
      {display}
    </span>
  );
}

export function SelectContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(SelectContext);
  if (!ctx?.open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={() => ctx.setOpen(false)}
      />
      <div
        className={cn(
          "absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 text-slate-800 shadow-xl animate-in fade-in-80",
          className
        )}
      >
        {children}
      </div>
    </>
  );
}

export function SelectItem({
  value,
  children,
  className,
  disabled,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const ctx = React.useContext(SelectContext);
  const isSelected = ctx?.value === value;


  return (
    <div
      onClick={() => ctx?.onValueChange(value)}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg py-1.5 pl-3 pr-8 text-xs outline-none hover:bg-sky-50 hover:text-sky-700 transition-colors",
        isSelected && "bg-sky-50 font-bold text-sky-700",
        className
      )}
    >
      <span className="truncate">{children}</span>
      {isSelected && (
        <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
          <Check className="h-4 w-4 text-sky-600" />
        </span>
      )}
    </div>
  );
}
