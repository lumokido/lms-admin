"use client";

import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface DateTimeControllerProps {
  name: string;
  label: string;
  control?: any;
  disabled?: boolean;
  rules?: any;
  inputClassName?: string;
}

const DateTimeController: React.FC<DateTimeControllerProps> = ({
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
            {rules?.required && (
              <span className="text-destructive"> *</span>
            )}
          </FormLabel>

          <FormControl>
            <Input
              type="datetime-local"
              className={inputClassName}
              value={
                field.value
                  ? format(new Date(field.value), "yyyy-MM-dd'T'HH:mm")
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value;

                field.onChange(
                  value ? new Date(value).toISOString() : undefined
                );
              }}
              onBlur={field.onBlur}
              disabled={disabled}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateTimeController;