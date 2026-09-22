"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { cn } from "@/lib/utils";

interface CheckboxControllerProps {
  name: string;
  label: string;
  rules?: any;
  control: any;
  disabled?: boolean;
  inputClassName?: string;
  caption?: string;
  onChange?: (checked: boolean, config?: any) => void;
  rowIndex?: number;
  parentName?: string;
  
}

const CheckboxController: React.FC<CheckboxControllerProps> = ({
  name,
  label,
  rules,
  control,
  disabled = false,
  inputClassName,
  caption,
  onChange,
  rowIndex,
  parentName,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      disabled={disabled}
    
      render={({ field }) => (
        <FormItem>
          <div className="flex flex-row space-x-3 space-y-0 items-center justify-start">
            <FormControl>
              <Checkbox
                checked={Boolean(field.value)}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  onChange?.(checked as boolean, { rowIndex, parentName });
                }}
                disabled={disabled}
                className={cn(inputClassName)}
              />
            </FormControl>
            <FormLabel className="text-sm font-normal">{label}</FormLabel>
            {caption && (
              <p className="text-sm text-muted-foreground">{caption}</p>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CheckboxController;
