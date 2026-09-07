import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    const variantStyles = {
      default: "bg-sky-500 text-white hover:bg-sky-600 shadow-sm shadow-sky-500/20",
      destructive: "bg-rose-500 text-white hover:bg-rose-600",
      outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700",
      secondary: "bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200",
      ghost: "hover:bg-slate-100 text-slate-700",
      link: "text-sky-600 underline-offset-4 hover:underline",
    };

    const sizeStyles = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-lg px-3 text-xs",
      lg: "h-11 rounded-xl px-8 text-sm",
      icon: "h-9 w-9",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
