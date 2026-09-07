"use client";
import type React from "react";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface InputControllerProps {
  name: string;
  disabled?: boolean;
  label: string;
  type?: "email" | "number" | "password" | "tel" | "text" | "url" | "float";
  control: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rules?: any;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  placeholder?: string;
  defaultValue?: string | number;
  bottomText?: string;
  className?: string;
  inputClassName?: string;
  bottomComponent?: React.ReactNode;
  bottomReactiveComponent?: (value: any) => React.ReactNode;
}

const InputController: React.FC<InputControllerProps> = ({
  name,
  label,
  type = "text",
  control,
  rules,
  disabled = false,
  icon,
  iconPosition = "left",
  onChange,
  placeholder,
  defaultValue,
  bottomText,
  className = "",
  bottomComponent,
  inputClassName,
  bottomReactiveComponent,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : type === "float"
      ? "number"
      : type;
  return (
    <FormField
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({
        field: { onBlur, onChange: controllerOnChange, value },
        fieldState: { error },
      }) => {
        const isRequired = rules?.required;
        const handleViewFile = () => {
          if (value) {
            window.open(value, "_blank");
          }
        };

        return (
          <FormItem>
            <FormLabel htmlFor={name}>
              {label}
              {isRequired && <span className="text-destructive"> *</span>}
            </FormLabel>
            <FormControl>
              <div className="relative flex items-center">
                {icon && iconPosition === "left" && (
                  <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
                    {icon}
                  </div>
                )}
                <Input
                  type={inputType}
                  disabled={disabled}
                  step={type === "float" ? "any" : undefined}
                  id={name}
                  placeholder={placeholder}
                  value={value !== null && value !== undefined ? value : ""}
                  onChange={(e) => {
                    let raw = e.target.value;

                    if (type === "number") {
                      raw = raw.replace(/\D/g, "");
                      raw = raw.slice(0, 12);
                    }

                    if (type === "float") {
                      raw = raw.replace(/[^0-9.]/g, "");

                      // Allow only one decimal point
                      const parts = raw.split(".");
                      if (parts.length > 2) {
                        raw = `${parts[0]}.${parts.slice(1).join("")}`;
                      }

                      raw = raw.slice(0, 12);
                    }

                    let finalValue: string | number = raw;

                    if (type === "number") {
                      finalValue = raw === "" ? "" : Number(raw);
                    }

                    if (type === "float") {
                      finalValue = raw === "" ? "" : parseFloat(raw);
                    }

                    controllerOnChange(finalValue);
                    onChange?.(e);
                  }}
                  onBlur={onBlur}
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  className={cn(
                    className,
                    icon && iconPosition === "left" && "pl-10",
                    (isPassword || (icon && iconPosition === "right")) &&
                      "pr-10",
                    (type === "number" || type === "float") &&
                      "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0",
                    inputClassName,
                    "focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/50 h-10 rounded-lg"
                  )}
                />
                <div className="absolute right-3 flex items-center">
                  {isPassword ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  ) : (
                    icon &&
                    iconPosition === "right" && (
                      <div className="pointer-events-none text-muted-foreground">
                        {icon}
                      </div>
                    )
                  )}
                </div>
                {type === "url" && value && (
                  <Button
                    onClick={handleViewFile}
                    variant="outline"
                    type="button"
                    className="h-9 right-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </FormControl>
            {bottomText && (
              <p className="text-sm text-muted-foreground mt-1.5">
                {bottomText}
              </p>
            )}
            {bottomComponent && bottomComponent}
            {bottomReactiveComponent && bottomReactiveComponent(value)}
            {error && <FormMessage>{error.message}</FormMessage>}
          </FormItem>
        );
      }}
    />
  );
};

export default InputController;
