import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

interface IndexProps {
  name: string;
  label: string;
  options: any;
  control: any;
  disabled?: boolean;
  rules?: any;
  onChange?: (value: string, config?: any) => void;
  onFocus?: (config?: any) => void;
  onBlur?: () => void;
  placeHolder?: string;
  inputClassName?: string;
  rowIndex?: number;
  parentName?: string;
}

const Index: React.FC<IndexProps> = ({
  name,
  label,
  options = [],
  control,
  disabled = false,
  rules,
  onChange,
  onFocus,
  onBlur,
  placeHolder,
  inputClassName,
  rowIndex,
  parentName,
}) => {
  const [search, setSearch] = useState("");
  const parentRef = useRef<HTMLDivElement>(null);

  const resolvedOptions =
    typeof options === "function" ? options(rowIndex) : options;
  const finalOptions = Array.isArray(resolvedOptions) ? resolvedOptions : [];

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return finalOptions;

    const keyword = search.toLowerCase();

    return finalOptions.filter((option) =>
      `${option.label} ${option.value}`.toLowerCase().includes(keyword),
    );
  }, [search, finalOptions]);

  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      disabled={disabled}
      render={({ field }) => {
        const isRequired = rules?.required;
         const selectedOption = finalOptions.find(
          (option) => option.value === field.value,
        );

        return (
          <FormItem>
            <FormLabel>
              {label}
              {isRequired && <span className="text-destructive"> *</span>}
            </FormLabel>

            <Select
              value={field.value || ""}
              key={`${name}-${field.value}-${finalOptions.length}-${finalOptions.map((o) => o.value).join("-")}`}
              disabled={disabled}
              onValueChange={(value) => {
                field.onChange(value);
                onChange?.(value, {
                  rowIndex,
                  parentName,
                });
              }}
              onOpenChange={(open) => {
                if (!open) {
                  field.onBlur();
                }
                if (open) {
                  onFocus?.({
                    rowIndex,
                    parentName,
                  });
                }
                onBlur?.();
              }}
            >
              <FormControl>
                <SelectTrigger
                  className={cn("w-full truncate px-4 h-10! rounded-lg", inputClassName)}
                >
                  <SelectValue
                    placeholder={placeHolder ? placeHolder : `Select ${label}`}
                  >
                    {selectedOption?.label}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>

              <SelectContent className="rounded-none border-b">
                <div
                  ref={parentRef}
                  className="sticky top-0 z-10 bg-background p-2 border-b "
                >
                  <Input
                    placeholder={`Search ${label}...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="w-full border h-10 rounded-lg"
                  />
                </div>

                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => (
                    <SelectItem
                      key={`${option.value}-${index}-${option.label}`}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ))
                ) : (
                  <div className="py-3 text-center text-sm text-muted-foreground">
                    No results found
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

export default Index;
