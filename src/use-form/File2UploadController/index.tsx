"use client";

import React from "react";
import {
  Controller,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import get from "lodash/get";

interface FileUploadProps {
  name: string;
  label: string;
  accept?: string[];
  maxSize?: number;
  className?: string;
  rules?: RegisterOptions;
}

const File2UploadController = ({
  name,
  label,
  accept = [],
  maxSize,
  className,
  rules,
}: FileUploadProps) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, name)?.message as string;

  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={`file-${name}`}
        className={cn(
          "text-sm font-medium",
          error && "text-destructive"
        )}
      >
        {label}
        {rules?.required && (
          <span className="ml-1 text-destructive">*</span>
        )}
      </label>

      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={null}
        render={({ field: { onChange } }) => (
          <>
            <input
              id={`file-${name}`}
              type="file"
              accept={accept
                ?.map((ext) => `.${ext}`)
                .join(",")}
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                if (maxSize && file.size > maxSize) {
                  return;
                }

                // onChange(file);

                setValue(
                  name,
                  {
                    name: file.name,
                    file,
                  },
                  {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  }
                );
              }}
              className="
                block w-full text-sm text-muted-foreground mt-4
                file:mr-4
                file:px-4
                file:py-2
                file:border
                file:border-black
                file:bg-background
                file:text-foreground
                file:text-sm
                file:font-medium
                file:rounded-md
                hover:file:bg-accent
              "
            />

            {error && (
              <p className="text-sm text-destructive">
                {error}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default File2UploadController;