import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";


interface EmptyProps {
  title: string; // Title to display
  description: string; // Description to display
  icon?: React.ReactNode; // Optional icon to display
  actionButton?: {
    label: string; // Label for the button
    location?: string; // Optional location for the button
  };
}

const Empty: React.FC<EmptyProps> = ({
  title,
  description,
  icon,
  actionButton,
}) => {
  const router = useRouter();
  
  const handleButtonClick = () => {
    if (actionButton?.location) {
      router.push(actionButton.location);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4">
      {icon && <>{icon}</>}
      <div className="items-center flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 text-center max-w-md">
          {description}
        </p>
      </div>
      {actionButton && (
        <Button className="cursor-pointer" onClick={handleButtonClick}>
          {actionButton.label}
        </Button>
      )}
    </div>
  );
};

export default Empty;
