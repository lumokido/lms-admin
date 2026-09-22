import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface InputAndSelectControllerProps {
  name: string;
  label: string;
  options: { value: string; label: string }[] | [];
  control: any;
  disabled?: boolean;
  rules?: any;
  onChange?: (value: string) => void;
  defaultValue?: string;
  onBlur?: () => void;
  isLoading?: boolean;
  allowCreate?: boolean; // ✅ new prop
  className?: string;
}

const InputAndSelectController: React.FC<InputAndSelectControllerProps> = ({
  name,
  label,
  options = [],
  control,
  disabled = false,
  rules,
  defaultValue = "",
  onChange,
  onBlur,
  isLoading = false,
  allowCreate = false,
  className,
}) => {
  const [localOptions, setLocalOptions] = useState(options);
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState("");
  // Track user-created options so they survive parent re-renders
  const createdOptionsRef = useRef<{ value: string; label: string }[]>([]);

  useEffect(() => {
    // Merge prop options with any user-created options
    const createdValues = new Set(
      createdOptionsRef.current.map((o) => o.value),
    );
    const merged = [
      ...options,
      ...createdOptionsRef.current.filter(
        (co) => !options.some((o) => o.value === co.value),
      ),
    ];
    setLocalOptions(merged);
  }, [options]);

  const handleAddNew = (fieldOnChange: (value: string) => void) => {
    if (!newValue.trim()) return;
    const normalized = newValue.trim().toLowerCase();

    // Check if an option with the same label or value already exists
    const existing = localOptions.find(
      (opt) =>
        opt.value.toLowerCase() === normalized ||
        opt.label.toLowerCase() === normalized,
    );

    if (existing) {
      // Option already exists — just select it
      fieldOnChange(existing.value);
      if (onChange) onChange(existing.value);
    } else {
      // Truly new — add to the list, persist in ref, and select it
      const newOption = { label: newValue.trim(), value: normalized };
      createdOptionsRef.current = [...createdOptionsRef.current, newOption];
      setLocalOptions((prev) => [...prev, newOption]);
      fieldOnChange(normalized);
      if (onChange) onChange(normalized);
    }

    setNewValue("");
    setIsAdding(false);
  };

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field }) => {
        const isRequired = rules?.required;
       

        // ✅ Fallback to defaultValue if form hasn’t initialized yet
        const selectedValue =
          field.value && field.value.trim() !== ""
            ? field.value
            : defaultValue || undefined;

        // Compute display options: include DB value if not in localOptions
        const displayOptions =
          selectedValue &&
          !localOptions.some((opt) => opt.value === selectedValue)
            ? [
                ...localOptions,
                {
                  label: selectedValue
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (c: string) => c.toUpperCase()),
                  value: selectedValue,
                },
              ]
            : localOptions;

        return (
          <FormItem className={cn("w-full", className)}>
            <FormLabel>
              {label}
              {isRequired && <span className="text-destructive"> *</span>}
            </FormLabel>

            <Select
              onValueChange={(value) => {
                field.onChange(value);
                if (onChange) onChange(value);
              }}
              disabled={disabled}
              value={selectedValue} // ✅ no empty string here
              onOpenChange={() => {
                if (onBlur) onBlur();
              }}
            >
              <FormControl>
                <SelectTrigger className="w-full min-w-0">
                  <SelectValue placeholder={`Select ${label}`} />
                </SelectTrigger>
              </FormControl>

              <SelectContent className="max-h-[300px] overflow-y-auto">
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : displayOptions.length > 0 ? (
                  displayOptions.map((option) =>
                    option.value ? (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ) : null,
                  )
                ) : (
                  <SelectItem value="no-options" disabled>
                    No options available
                  </SelectItem>
                )}

                {/* 🆕 Add City Section */}
                {allowCreate && !isAdding && (
                  <div className="border-t mt-1 pt-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setIsAdding(true)}
                    >
                      + Add new {label}
                    </Button>
                  </div>
                )}

                {/* Inline Input for adding new */}
                {allowCreate && isAdding && (
                  <div
                    className="p-2 border-t space-y-2"
                    onPointerDown={(event) => event.stopPropagation()}
                  >
                    <Input
                      placeholder={`Enter new ${label}`}
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={(event) => event.stopPropagation()}
                      onKeyDown={(event) => event.stopPropagation()}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAddNew(field.onChange)}
                      >
                        Add
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsAdding(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default InputAndSelectController;
