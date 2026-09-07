"use client";
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import "react-day-picker/style.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface DateControllerProps {
  name: string;
  label: string;
  control?: any;
  disabled?: boolean;
  rules?: any;
  dateFormat?: string;
  allowFutureDates?: boolean;
  autoClose?: boolean;
  dayDisabled?: (date: Date) => boolean;
  inputClassName?: string;
}

const DateController: React.FC<DateControllerProps> = ({
  name,
  label,
  control,
  disabled = false,
  rules,
  dateFormat = "dd-MM-yyyy",
  allowFutureDates = true,
  autoClose = false,
  dayDisabled,
  inputClassName,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => {
        const isDateValid = (val: any) => {
          if (val instanceof Date) return !isNaN(val.getTime());
          if (typeof val === "string" || typeof val === "number") {
            const parsed = Date.parse(String(val));
            return !isNaN(parsed);
          }
          return false;
        };

        const parsedDate = isDateValid(field.value)
          ? new Date(field.value)
          : undefined;

        return (
          <FormItem>
            <FormLabel>
              {label}
              {rules?.required && <span className="text-destructive"> *</span>}
            </FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                      "w-full h-9 px-3 py-1 text-left font-normal rounded-none shadow-none  focus-visible:ring-0 focus-visible:border-[#9A9A9A]",
                      !field.value && "text-muted-foreground",
                      inputClassName,
                    )}
                  >
                    {parsedDate ? (
                      format(parsedDate, dateFormat)
                    ) : (
                      <span>{label}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parsedDate}
                  captionLayout="dropdown"
                  startMonth={new Date(2010, 0)}
                  endMonth={allowFutureDates ? new Date(2100, 11) : todayEnd}
                  disabled={(date) => {
                    const blockedByFutureFlag = allowFutureDates
                      ? false
                      : date > todayEnd;

                    const blockedByCustom =
                      typeof dayDisabled === "function"
                        ? dayDisabled(date)
                        : false;

                    return blockedByFutureFlag || blockedByCustom;
                  }}
                  onSelect={(date) => {
                    if (date) {
                      field.onChange(date);
                      field.onBlur();

                      if (autoClose) {
                        setOpen(false);
                      }
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default DateController;
