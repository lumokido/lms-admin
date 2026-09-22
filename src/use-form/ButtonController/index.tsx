"use client";
import type React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

interface ButtonControllerProps {
  name: string;
  label?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  inputClassName?: string;
  value: string;
}

const ButtonController: React.FC<ButtonControllerProps> = ({
  name,
  label,
  disabled = false,
  icon,
  onClick,
  inputClassName,
  value,
}) => {
  console.log("CLassName", inputClassName);
  const { setValue, watch } = useFormContext();
  const isSelected = watch(name) === value;
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setValue(name, value);
    onClick && onClick(e);
  };
  return (
    <button
      id={value}
      disabled={disabled}
      onClick={handleClick}
      type="button"
      className={cn(
        disabled && "cursor-not-allowed opacity-50 bg-gray-200",
        "flex flex-col items-center justify-center gap-2 duration-200 p-2 ",
        inputClassName,
      )}
    >
      {icon}
      <p className=" font-normal">{label}</p>
    </button>
  );
};

export default ButtonController;
