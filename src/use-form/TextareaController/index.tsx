import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TextareaControllerProps {
  name: string;
  disabled?: boolean;
  label: string;
  control: any;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rules?: any;
  bottomText?: string;
  inputClassName?: string;
  colSpan?:string
}

const TextareaController: React.FC<TextareaControllerProps> = ({
  name,
  label,
  control,
  rules,
  bottomText,
  disabled = false,
  onChange,
  inputClassName,
  colSpan
}) => {
  return (
    <FormField
      name={name}
      control={control}
      key={name}
      rules={rules}
      render={({
        field: { onBlur, onChange: controllerOnChange, value },
        fieldState: { error },
      }) => {
        const isRequired = rules?.required;
        return (
          <FormItem>
            <FormLabel htmlFor={name}>
              {label}
              {isRequired && <span className="text-destructive">*</span>}
            </FormLabel>
            <FormControl>
              <div className="col-span-3">
                <Textarea
                  disabled={disabled}
                  id={name}
                  wrap="soft"
                  value={value || ""}
                  onChange={(e) => {
                    controllerOnChange(e);
                    onChange && onChange(e);
                  }}
                  className={cn(
                    "resize-none overflow-x-hidden overflow-y-auto max-h-72 min-h-[132px] scrollbar-hide break-all whitespace-pre-wrap col-span-3",
                    inputClassName,
                  )}
                />
                {bottomText && (
                  <span className="text-sm text-gray-500">{bottomText}</span>
                )}
              </div>
            </FormControl>
            {error && <FormMessage>{error.message}</FormMessage>}
          </FormItem>
        );
      }}
    />
  );
};

export default TextareaController;
