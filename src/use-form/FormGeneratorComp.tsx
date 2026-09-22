import { Fragment } from "react/jsx-runtime";
import ControllerMap from "./ControllerMap";
import { cn } from "@/lib/utils";

export default function FormGeneratorComp({props}: {props: any}) {
  return (
    <>
      {props.map((field: any) => {
        const { hidden = false, fullWidth = false, className, colSpan } = field;
        const key = `${field.name}`;
        
        if (field.type === "heading") {
          return (
            <div key={key} className={cn("col-span-12 mt-4 border-b pb-2", className)}>
              <h3 className="font-semibold text-lg">{field.label}</h3>
            </div>
          );
        }

        return hidden ? null : (
          <Fragment key={key}>
            <div className={cn(fullWidth && "col-span-2", colSpan, className)}>
              <ControllerMap {...field} />
            </div>
          </Fragment>
        );
      })}
    </>
  );
}