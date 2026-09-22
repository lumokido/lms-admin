"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import get from "lodash/get";
import { useFormContext, Controller, RegisterOptions } from "react-hook-form";
import { Upload, Check, FileIcon, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useSinglePresignedUrl from "@/module/FileUpload/useSinglePresignedUrl";
import useSingleFileUpload from "@/module/FileUpload/useSingleFileUpload";
import useGetSingleFileUrl from "@/module/FileUpload/useGetSingleFileUrl";

function getUploadErrorMessage(error: unknown): string {
  console.log(error, "error called")
  if (error && typeof error === "object" && "response" in error) {
    const data = (error as { response?: { data?: { message?: string } } })
      .response?.data;
    if (data?.message && typeof data.message === "string") return data.message;
  }
  if (error instanceof Error) return error.message;
  return "Upload failed. Please try again.";
}

interface FileUploadProps {
  name: string;
  label: string;
  accept?: string[];
  maxSize?: number;
  className?: string;
  rules?: RegisterOptions;
  disabled?: boolean;
  meta?: {
    refId: string;
    belongsTo: string;
    isPublic: boolean;
  };
  isDirty?: boolean;
}

const SUCCESS_DISMISS_MS = 4000;

function FileUploadController({
  name,
  label,
  accept = [],
  maxSize,
  className,
  rules,
  meta,
  isDirty = true,
  disabled = false,
}: FileUploadProps) {
  const { getSinglePresignedUrl } = useSinglePresignedUrl();
  const { uploadFile } = useSingleFileUpload();
  const { getFileUrl } = useGetSingleFileUrl();
  const {
    setValue,
    watch,
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext();
  const values = watch(name);
  const file = values?.name;
  const fileUrl = values?.url;

  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const successDismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (successDismissRef.current) clearTimeout(successDismissRef.current);
    };
  }, []);

  const dismissSuccessSoon = () => {
    if (successDismissRef.current) clearTimeout(successDismissRef.current);
    successDismissRef.current = setTimeout(() => {
      setSuccessMessage(null);
      successDismissRef.current = null;
    }, SUCCESS_DISMISS_MS);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (maxSize && selectedFile.size > maxSize) {
      setError(
        name,
        {
          type: "manual",
          message: `File size exceeds the limit of ${maxSize / 1024 / 1024} MB`,
        },
        { shouldFocus: true }
      );
      e.target.value = "";
      return;
    }

    clearErrors(name);
    setSuccessMessage(null);
    setIsUploading(true);

    try {
      const presigned = await getSinglePresignedUrl({
        fileName: selectedFile.name,
        mimeType: selectedFile.type,
        fileSize: selectedFile.size,
        refId: meta?.refId || "",
        belongsTo: meta?.belongsTo || "",
        isPublic: meta?.isPublic || false,
      });

      const uploadRes = await uploadFile({
        url: presigned.data.uploadUrl,
        file: selectedFile,
      });

      if (uploadRes.status !== 200) {
        throw new Error(`Upload failed with status ${uploadRes.status}`);
      }

      const fileResponse = await getFileUrl(presigned.data.assetS3Object._id);

      setValue(
        name,
        {
          name: selectedFile.name,
          url: fileResponse.data.url,
        },
        {
          shouldDirty: isDirty,
          shouldTouch: isDirty,
          shouldValidate: isDirty,
        }
      );

      setSuccessMessage("File uploaded successfully.");
      dismissSuccessSoon();
    } catch (err) {
      setError(
        name,
        {
          type: "manual",
          message: getUploadErrorMessage(err),
        },
        { shouldFocus: true }
      );
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemove = (onChange: (value: null) => void) => {
    if (successDismissRef.current) {
      clearTimeout(successDismissRef.current);
      successDismissRef.current = null;
    }
    setSuccessMessage(null);
    clearErrors(name);
    setValue(
      name,
      {
        name: null,
        url: null,
      },
      {
        shouldValidate: true,
      }
    );
    onChange(null);
  };

  const description = `Accepts: ${accept?.map((ext) => `${ext}`).join(", ")}${
    maxSize ? ` (Max size: ${maxSize / 1024 / 1024} MB)` : ""
  }`;

  const error = get(errors, name)?.message as string;

  const describedBy = [
    error ? `${name}-error` : null,
    successMessage ? `${name}-success` : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className={cn(className)}>
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={name}
          className={cn("text-sm font-medium", error && "text-destructive")}
        >
          {label}
          {rules?.required && <span className="ml-1 text-destructive ">*</span>}
        </label>

        <span className="text-xs text-muted-foreground text-right">{description}</span>
      </div>

      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={null}
        render={({ field: { onChange } }) => (
          <div className="relative">
            <div
              className={cn(
                "flex items-center gap-4 border border-border rounded-none shadow-none p-3 w-full",
                errors[name] && "border-destructive",
                error && "border-destructive",
                successMessage && !error && "border-green-600/50"
              )}
            >
              <div className="flex flex-1 items-center gap-2 min-w-0">
                {isUploading ? (
                  <>
                    <Spinner className="shrink-0 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Uploading…
                    </span>
                  </>
                ) : file ? (
                  <>
                    <Check className="h-5 w-5 shrink-0 text-green-500" />
                    <p className="truncate text-sm max-w-75">{file}</p>
                    {fileUrl && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 transition-colors"
                              aria-label="Preview file"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Preview file</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </>
                ) : (
                  <>
                    <FileIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      No file selected
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                {file && !isUploading ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemove(onChange)}
                    className="h-9 px-2 rounded-none"
                  >
                    <X className="h-4 w-4 mr-1" />
                    <span className="sr-only md:not-sr-only md:inline">
                      Remove
                    </span>
                  </Button>
                ) : null}

                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="h-9 rounded-none"
                  disabled={isUploading|| disabled}
                >
                  <label
                    htmlFor={`file-${name}`}
                    className={cn(
                      "cursor-pointer",
                      isUploading && "pointer-events-none opacity-50"
                    )}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    <span>{file ? "Replace" : "Upload"}</span>
                  </label>
                </Button>

                <input
                  type="file"
                  className="sr-only"
                  id={`file-${name}`}
                  accept={accept?.map((ext) => `.${ext}`).join(",")}
                  onChange={(e) => handleFileChange(e)}
                  disabled={isUploading}
                  aria-describedby={describedBy}
                  aria-busy={isUploading}
                />
              </div>
            </div>
            {error && (
              <p id={`${name}-error`} className="text-sm text-destructive mt-1">
                {error}
              </p>
            )}
            {successMessage && !error && (
              <p
                id={`${name}-success`}
                role="status"
                className="text-sm text-green-600 mt-1"
              >
                {successMessage}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}

export default FileUploadController;
