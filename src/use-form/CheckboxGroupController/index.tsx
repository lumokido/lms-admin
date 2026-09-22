"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface CheckboxOption {
  label: string;
  value: string;
}

interface CheckboxGroupControllerProps {
  name: string;
  label: string;
  control: any;
  rules?: any;
  disabled?: boolean;
  options: CheckboxOption[];
  inputClassName?: string;
}

const CheckboxGroupController = ({
  name,
  label,
  control,
  rules,
  disabled = false,
  options,
  inputClassName,
}: CheckboxGroupControllerProps) => {
  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {rules?.required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </FormLabel>

          <div className="flex items-center gap-6 pt-2">
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2"
              >
                <FormControl>
                  <Checkbox
                    checked={field.value === option.value}
                    onCheckedChange={(checked) =>
                      checked && field.onChange(option.value)
                    }
                    disabled={disabled}
                    className={cn(inputClassName)}
                  />
                </FormControl>

                <span className="text-sm">{option.label}</span>
              </div>
            ))}
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CheckboxGroupController;