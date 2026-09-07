"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import React from "react";
import { Controller } from "react-hook-form";

interface RadioControllerProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  control: any;
  rules?: any;
  disabled?: boolean;
  inputClassName?: string;
  radioClass?: string;
  containerClassName?: string;
  labelClass?: string;
}

const RadioController: React.FC<RadioControllerProps> = ({
  name,
  label,
  options,
  control,
  rules,
  disabled,
  inputClassName,
  radioClass,
  containerClassName,
  labelClass,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <FormItem className={cn("space-y-3", containerClassName)}>
          <FormLabel htmlFor={name} className={cn(labelClass)}>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className={cn("flex", radioClass)}
            >
              {options.map((option,index) => (
                <FormItem key={`${name}-${option.value}-${index}`} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem
                      className={cn("font-normal", inputClassName)}
                      value={option.value}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{option.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RadioController;
