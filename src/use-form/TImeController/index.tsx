"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TimeControllerProps {
  name: string;
  label: string;
  control?: any;
  disabled?: boolean;
  rules?: any;
  inputClassName?: string;
}

const TimeController: React.FC<TimeControllerProps> = ({
  name,
  label,
  control,
  disabled = false,
  rules,
  inputClassName,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      rules={rules}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {rules?.required && <span className="text-destructive"> *</span>}
          </FormLabel>

          <FormControl>
            <Input
              type="time"
              disabled={disabled}
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              className={cn(
                "h-9 rounded-none shadow-none focus-visible:ring-0 focus-visible:border-[#9A9A9A] [&::-webkit-calendar-picker-indicator]:hidden",
                inputClassName,
              )}
              placeholder="00:00"
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TimeController;
