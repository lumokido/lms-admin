// import { useFieldArray, useFormContext } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Plus, Trash2 } from "lucide-react";
// import FormGeneratorComp from "../FormGeneratorComp";
// import { FormFieldConfig } from "../ControllerMap";
// import { useEffect } from "react";
// import { cn } from "@/lib/countryOptions";

// interface FieldArrayControllerProps {
//   control: any;
//   name: string;
//   label?: string;
//   disabled?: boolean;
//   inputClassName?: string;

//   fieldArrayConfig: {
//     fields?: FormFieldConfig[];
//     addButtonText?: string;
//     removeButtonText?: string;
//     defaultItem: Record<string, any>;
//     gridClassName?: string;
//     layout?: "table" | "grid";
//     scrollableX?: boolean;
//     renderRow?: (props: {
//       control: any;
//       rowIndex: number;
//       parentName: string;
//       disabled?: boolean;
//     }) => React.ReactNode;
//   };
// }

// export default function FieldArrayController({
//   control,
//   name,
//   label,
//   disabled,
//   fieldArrayConfig,
//   inputClassName,
// }: FieldArrayControllerProps) {
//   const {
//     fields: items,
//     append,
//     remove,
//   } = useFieldArray({
//     control,
//     name,
//   });
//   const isTable = fieldArrayConfig.layout === "table";
//   const useRenderRow = !!fieldArrayConfig.renderRow;
//   const fields = fieldArrayConfig.fields ?? [];
//   const { trigger, getValues } = useFormContext();
//   const handleAdd = async () => {
//     if (disabled) return;
//     const currentRows = getValues(name) || [];

//     if (currentRows.length > 0) {
//       const lastIndex = currentRows.length - 1;

//       if (fields.length > 0) {
//         const fieldNames = fields.map(
//           (field) => `${name}.${lastIndex}.${field.name}`,
//         );

//         const isValid = await trigger(fieldNames);

//         if (!isValid) {
//           return;
//         }
//       }
//     }

//     append(
//       typeof fieldArrayConfig.defaultItem === "function"
//         ? fieldArrayConfig.defaultItem()
//         : fieldArrayConfig.defaultItem,
//     );
//   };
//   useEffect(() => {
//     if (disabled) return;
//     if (items.length === 0) {
//       append(
//         typeof fieldArrayConfig.defaultItem === "function"
//           ? fieldArrayConfig.defaultItem()
//           : fieldArrayConfig.defaultItem,
//       );
//     }
//   }, [items.length, append, fieldArrayConfig.defaultItem]);

//   if (isTable) {
//     return (
//       <div className={cn("rounded-md", inputClassName)}>
//         {/* Header */}
//         <h3 className=" mb-5 font-semibold text-lg">{label}</h3>
//         <div className="border border-border">
//           <div
//             className={cn(
//               fieldArrayConfig.scrollableX && "overflow-x-auto scrollbar-hide",
//             )}
//           >
//             <div className="min-w-max">
//               <div
//                 className="grid bg-slate-800 text-white"
//                 style={{
//                   gridTemplateColumns: useRenderRow
//                     ? "1fr 80px"
//                     : `repeat(${fields.length}, minmax(180px,1fr)) 80px`,
//                 }}
//               >
//                 {!useRenderRow &&
//                   fields.map((field) => (
//                     <div
//                       key={field.name}
//                       className="px-4 py-3 text-sm font-semibold"
//                     >
//                       {field.label}
//                     </div>
//                   ))}

//                 {!useRenderRow && (
//                   <div className="px-4 py-3 text-sm font-semibold">Action</div>
//                 )}
//               </div>
//               {/* Rows */}
//               {items.map((item, index) => (
//                 <div
//                   key={item.id}
//                   className="grid items-center border-border"
//                   style={{
//                     gridTemplateColumns: useRenderRow
//                       ? "1fr 80px"
//                       : `repeat(${fields.length}, minmax(180px,1fr)) 80px`,
//                   }}
//                 >
//                   {fieldArrayConfig.renderRow ? (
//                     <div
//                       className="px-4 py-3 col-span-full"
//                       style={{
//                         gridColumn: "1 / 2",
//                       }}
//                     >
//                       {fieldArrayConfig.renderRow({
//                         control,
//                         rowIndex: index,
//                         parentName: name,
//                         disabled: disabled,
//                       })}
//                     </div>
//                   ) : (
//                     fields.map((field) => (
//                       <div key={field.name} className="px-4 py-3">
//                         <FormGeneratorComp
//                           props={[
//                             {
//                               ...field,
//                               rowIndex: index,
//                               parentName: name,
//                               control,
//                               label: "",
//                               name: `${name}.${index}.${field.name}`,
//                               disabled: disabled || field?.disabled,
//                             },
//                           ]}
//                         />
//                       </div>
//                     ))
//                   )}

//                   <div className="flex justify-center gap-2">
//                     {index === items.length - 1 && (
//                       <Button
//                         type="button"
//                         size="icon"
//                         variant="ghost"
//                         onClick={handleAdd}
//                         disabled={disabled}
//                       >
//                         <Plus className="h-4 w-4" />
//                       </Button>
//                     )}

//                     {items.length > 1 && (
//                       <Button
//                         type="button"
//                         size="icon"
//                         variant="ghost"
//                         onClick={() => remove(index)}
//                         disabled={disabled}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={cn("space-y-4", inputClassName)}>
//       <div className="flex items-center justify-between">
//         {label && <h3 className="font-semibold text-lg">{label}</h3>}

//         <Button
//           type="button"
//           variant="outline"
//           size="sm"
//           onClick={handleAdd}
//           disabled={disabled}
//           className="bg-primary/10 border-primary text-primary hover:bg-primary/20 hover:text-primary h-9"
//         >
//           <Plus className="h-4 w-4 mr-2" />
//           {fieldArrayConfig.addButtonText}
//         </Button>
//       </div>

//       {items.map((item, index) => {
//         const rowFields = fields.map((field) => {
//           let isDisabled = field.disabled;
//           if (typeof field.disabled === "function") {
//             isDisabled = (field.disabled as any)(index) || disabled;
//           }

//           let resolvedRules = field.rules;
//           if (isDisabled) {
//             resolvedRules = { required: false };
//           }

//           return {
//             ...field,
//             disabled: isDisabled,
//             rules: resolvedRules,
//             control,
//             name: `${name}.${index}.${field.name}`,
//             rowIndex: index,
//             parentName: name,
//           };
//         });

//         return (
//           <div key={item.id} className="border rounded-md p-4 space-y-4">
//             <div
//               className={`grid gap-4 ${
//                 fieldArrayConfig.gridClassName ?? "grid-cols-1 md:grid-cols-2"
//               }`}
//             >
//               {fieldArrayConfig.renderRow ? (
//                 fieldArrayConfig.renderRow({
//                   control,
//                   rowIndex: index,
//                   parentName: name,
//                   disabled: disabled,
//                 })
//               ) : (
//                 <FormGeneratorComp props={rowFields} />
//               )}
//             </div>

//             {items.length > 1 && (
//               <div className="flex justify-end">
//                 <Button
//                   type="button"
//                   variant="destructive"
//                   size="sm"
//                   onClick={() => remove(index)}
//                   disabled={disabled}
//                   className="h-8"
//                 >
//                   <Trash2 className=" w-4 mr-2" />
//                   {fieldArrayConfig.removeButtonText}
//                 </Button>
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }
