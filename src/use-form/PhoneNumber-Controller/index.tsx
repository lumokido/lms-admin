// "use client";

// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { cn } from "@/lib/utils";
// import { useFormContext } from "react-hook-form";

// import {
//   PhoneInput,
//   CountryIso2,
// } from "react-international-phone";
// import "react-international-phone/style.css";

// interface PhoneInputControllerProps {
//   name: string;
//   label: string;
//   control: any;
//   rules?: any;
//   disabled?: boolean;
//   defaultValue?: string;
//   placeholder?: string;
//   inputClassName?: string;
//   className?: string;
//   split?: {
//     countryCode: string;
//     phoneNumber: string;
//   };
//   onChange?: (value: string) => void;
// }

// const PhoneInputController = ({
//   name,
//   label,
//   control,
//   rules,
//   disabled = false,
//   defaultValue = "",
//   placeholder = "Enter phone number",
//   inputClassName,
//   className,
//   split,
//   onChange,
// }: PhoneInputControllerProps) => {
//   const { setValue } = useFormContext();

//   return (
//     <FormField
//       control={control}
//       name={name}
//       defaultValue={defaultValue}
//       rules={rules}
//       render={({ field }) => {
//         const isRequired = !!rules?.required;

//         return (
//           <FormItem className={cn("w-full", className)}>
//             <FormLabel>
//               {label}
//               {isRequired && (
//                 <span className="ml-1 text-destructive">*</span>
//               )}
//             </FormLabel>

//             <FormControl>
//               <PhoneInput
//                 defaultCountry={"in" as CountryIso2}
//                 value={field.value ?? ""}
//                 disabled={disabled}
//                 placeholder={placeholder}
//                 onChange={(phone, meta) => {
//                   // Always keep the PhoneInput controlled
//                   field.onChange(phone);

//                   if (split) {
//                     const dialCode = `+${meta.country.dialCode}`;

//                     const localNumber = phone.startsWith(dialCode)
//                       ? phone.slice(dialCode.length)
//                       : phone;

//                     setValue(split.countryCode, dialCode, {
//                       shouldDirty: true,
//                       shouldValidate: true,
//                     });

//                     setValue(split.phoneNumber, localNumber, {
//                       shouldDirty: true,
//                       shouldValidate: true,
//                     });
//                   }

//                   onChange?.(phone);
//                 }}
//                 inputClassName={cn(
//                   "!h-10 !w-full !rounded-none",
//                   inputClassName
//                 )}
//                 countrySelectorStyleProps={{
//                   buttonClassName:
//                     "!h-10 !rounded-none !border-r !border-input px-5!",
//                 }}
//               />
//             </FormControl>

//             <FormMessage />
//           </FormItem>
//         );
//       }}
//     />
//   );
// };

// export default PhoneInputController;