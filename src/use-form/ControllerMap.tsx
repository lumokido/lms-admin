'use client';

import React from "react";
import { Control } from "react-hook-form";
import SelectController from "./SelectController";
import InputController from "./InputController";
import TextareaController from "./TextareaController";
import { useFormMode } from "./FormMode";

const ControllerMap = (props: any) => {
  const { isReadOnly } = useFormMode();
  const mergedProps = {
    ...props,
    disabled: Boolean(isReadOnly || props?.disabled),
  };
  const { type } = mergedProps;

  switch (type) {
    case "select":
      return <SelectController {...mergedProps} />;
    case "textarea":
      return <TextareaController {...mergedProps} />;
    case "text":
    case "number":
    case "email":
    case "password":
    case "url":
    case "tel":
    case "float":
    default:
      return <InputController {...mergedProps} />;
  }
};

export type FormFieldConfig = {
  name?: string;
  label?: string;
  labelIcon?: any;
  type?:
    | "text"
    | "number"
    | "float"
    | "email"
    | "password"
    | "url"
    | "select"
    | "checkbox"
    | "otp"
    | "textarea"
    | "fieldArray"
    | "file"
    | "file2"
    | "date"
    | "time"
    | "radio"
    | "tel"
    | "tagsinput"
    | "inputGroup"
    | "switch"
    | "button"
    | "inputSelectController"
    | "logoImage"
    | "image"
    | "switch2"
    | "imageAndFile"
    | "multiImage"
    | "phoneNumber"
    | "checkbox-group"
    | "date-time"
    | "inputAndSelectController";
  allowCreate?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string; disabled?: boolean }[];
  noOfFiles?: number;
  accept?: string[];
  rules?: any;
  control: Control<any>;
  hidden?: boolean;
  onChange?: (e: any, config?: any) => void;
  watch?: any;
  setValue?: (name: string, value: any, options?: any) => void;
  fullWidth?: boolean;
  errors?: any;
  selectName?: string;
  selectRules?: any;
  inputOptions?: { value: string; label: string }[];
  position?: "left" | "right";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  inputClassName?: string;
  variant?:
    | "default"
    | "outline"
    | "destructive"
    | "secondary"
    | "ghost"
    | "assetButton";
  size?: "default" | "sm" | "lg" | "icon";
  text?: string;
  onClick?: () => void;
  value?: string;
  placeholder?: string;
  maxSize?: number;
  bottomText?: string;
  allowFutureDates?: boolean;
  dateFormat?: string;
  meta?: {
    refId: string;
    belongsTo: string;
    isPublic: boolean;
  };
  defaultValue?: string | number;
  onBlur?: () => void;
  onFocus?: (config?: any) => void;
  inputType?: "text" | "number";
  autoClose?: boolean;
  dayDisabled?: (date: Date) => boolean;
  isDirty?: boolean;
  countryCode?: string;
  withSearch?: boolean;
  placeHolder?: string;
  colSpan?: string;
  bottomComponent?: React.ReactNode;
  bottomReactiveComponent?: (value: any) => React.ReactNode;
  caption?: string;
  labelClass?: string;
  radioClass?: string;
  checkboxLabel?: string;
  rowIndex?: number;
  parentName?: string;
  containerClassName?: string;
  fieldArrayConfig?: {
    fields?: FormFieldConfig[];
    defaultItem: Record<string, any>;
    gridClassName?: string;
    addButtonText?: string;
    removeButtonText?: string;
    scrollableX?: boolean;
    layout?: "grid" | "table";
    renderRow?: (props: {
      control: any;
      rowIndex: number;
      parentName: string;
      disabled?: boolean;
    }) => React.ReactNode;
  };
  split?: {
    countryCode: string;
    phoneNumber: string;
  };
};

export default ControllerMap;
