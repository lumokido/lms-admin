'use client';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import React from "react";

interface Switch2ControllerProps {
  name: string;
  label: string;
  rules?: any;
  control: any;
  disabled?: boolean;
}

const Switch2Controller: React.FC<Switch2ControllerProps> = ({
  name,
  label,
  rules,
  control,
  disabled = false,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      rules={rules}
      render={({ field }) => {
        // Convert string value to boolean for the Switch
        const isActive = field.value === "active";

        return (
          <FormItem className="flex flex-row space-x-3  items-center justify-end">
              <FormControl>
                <Switch
                className="h-full flex items-center"
                  checked={isActive}
                  onCheckedChange={(checked) =>
                    field.onChange(checked ? "active" : "inactive")
                  }
                />
              </FormControl>
            <FormLabel className="text-sm font-normal flex justify-center items-center mb-2">
              {label}: {" "}
              <span className="text-sm font-semibold ml-1">
                {isActive ? "Active" : "Inactive"}
              </span>
            </FormLabel>
          </FormItem>
        );
      }}
    />
  );
};

export default Switch2Controller;
