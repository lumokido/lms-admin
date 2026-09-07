"use client";

import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpControllerProps {
  name: string;
  label: string;
  control: any;
  rules?: any;
  length?: number;
  disabled?: boolean;
  className?: string;
}

const OtpController: React.FC<OtpControllerProps> = ({
  name,
  label,
  control,
  rules,
  length = 6,
  disabled,
  className,
}) => {
  return (
    <FormField
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <InputOTP
              maxLength={length}
              value={field.value ?? ""}
              onChange={field.onChange}
              disabled={disabled}
              className={className}
            >
              <InputOTPGroup className="w-full rounded-none">
                {Array.from({ length }).map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="
                      h-15 w-15 rounded-none last:rounded-r-none  first:rounded-l-none border border-input text-lg
                    "
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </FormControl>

          {error && <FormMessage>{error.message}</FormMessage>}
        </FormItem>
      )}
    />
  );
};

export default OtpController;
