"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { Controller } from "react-hook-form";
import SearchableSelect from "./SearchableSelect";

interface Option {
  value: string;
  label: string;
}

interface InputGroupControllerProps {
  name: string;
  selectName: string;
  label: string;
  options: Option[];
  control: any;
  disabled?: boolean;
  rules?: any;
  selectRules?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: any;
  position?: "left" | "right";
  inputType?: "text" | "number";
  withSearch?: boolean;
}

/**
 * A controlled input field with a dropdown select, integrated with React Hook Form
 * using InputGroupCombo
 * @param props - Component properties
 */
const InputGroupController: React.FC<InputGroupControllerProps> = ({
  label,
  rules,
  selectRules,
  errors,
  name,
  selectName,
  control,
  disabled,
  onChange,
  options = [],
  position = "right",
  inputType = "text",
  withSearch = false,
}) => {
  // Early return if required props are missing
  if (!name || !selectName || !control) {
    console.error("InputGroupController: Missing required props", {
      name,
      selectName,
      control,
    });
    return null;
  }

  const isRequired = rules?.required || selectRules?.required;
  const objectName =
    name && typeof name === "string" && name.includes(".")
      ? name.substring(0, name.indexOf("."))
      : "";
  return (
    <div className="space-y-2">
      {/* InputGroupCombo */}
      <Label className={`${objectName && errors?.[objectName] ? "" : ""}`}>
        {label}
        {isRequired && <span className="text-destructive"> *</span>}
      </Label>
      <div
        className={`flex items-start ${
          position === "left"
            ? "flex-row-reverse space-x-2 space-x-reverse"
            : "flex-row space-x-2"
        }`}
      >
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({
            field: { onBlur, onChange: controllerOnChange, value },
            fieldState: { error },
          }) => (
            <div className="w-2/3">
              <Input
                id={name}
                disabled={disabled}
                type={inputType}
                onChange={(e) => {
                  const value = e.target.value || "";
                  if (onChange) {
                    onChange(e);
                  }
                  controllerOnChange(value);
                  if (inputType === "number") {
                    const num = Number(value);
                    controllerOnChange(isNaN(num) ? "" : num);
                  }
                }}
                onBlur={onBlur}
                value={value || ""}
                className={`${error ? "border-red-500" : ""}`}
              />
              {error && (
                <span className="text-sm text-red-500">{error.message}</span>
              )}
            </div>
          )}
        />
        <Controller
          name={selectName}
          control={control}
          rules={selectRules}
          render={({ field, fieldState: { error } }) => (
            <div className="w-1/3">
              {withSearch ? (
                <SearchableSelect
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                    control.clearErrors?.("root"); // optional
                  }}
                  options={options}
                  error={!!error}
                />
              ) : (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger
                    className={`w-full ${error ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>

                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {error && (
                <span className="text-sm text-red-500">{error.message}</span>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default InputGroupController;
