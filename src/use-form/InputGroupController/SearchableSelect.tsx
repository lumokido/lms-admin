// "use client";

// import React, { useState } from "react";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Command,
//   CommandInput,
//   CommandItem,
//   CommandList,
//   CommandEmpty,
// } from "@/components/ui/command";
// import { ChevronsUpDown, Check } from "lucide-react";
// import type { Country } from "react-phone-number-input";
// import flags from "react-phone-number-input/flags";

// interface Option {
//   value: string;
//   label: string;
//   iso2?: Country;
//   key?: string;
// }

// function CountryFlag({ iso2 }: { iso2?: Country }) {
//   if (!iso2) return null;
//   const Flag = flags[iso2];
//   return Flag ? <Flag title="" /> : null;
// }

// interface Props {
//   value?: string;
//   onChange: (value: string) => void;
//   options: Option[];
//   placeholder?: string;
//   error?: boolean;
// }

// const SearchableSelect: React.FC<Props> = ({
//   value,
//   onChange,
//   options,
//   placeholder = "Select",
//   error,
// }) => {
//   const [open, setOpen] = useState(false);

//   const selected = options.find((opt) => opt.value === value);

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <button
//           type="button"
//           className={`w-full h-9 border border-[#9A9A9A] rounded-none shadow-none flex items-center justify-between px-2.5 bg-white ${
//             error ? "border-red-500" : ""
//           }`}
//         >
//           {selected ? (
//             <div className="inline-flex items-center gap-2 text-xs">
//               <div className="flex items-center h-6 w-6">
//                 <CountryFlag iso2={selected.iso2} />
//               </div>
//               <p className="inline">{selected.label}</p>
//             </div>
//           ) : (
//             <span className="text-muted-foreground">{placeholder}</span>
//           )}

//           <ChevronsUpDown className="h-4 w-4 opacity-50" />
//         </button>
//       </PopoverTrigger>

//       <PopoverContent className="w-full p-2">
//         <Command>
//           <CommandInput
//             placeholder="Search..."
//             className="
//               border-none! outline-none! ring-0! shadow-none!
//               focus:ring-0! focus:outline-none!
//               focus-visible:ring-0! focus-visible:ring-offset-0!
//             "
//           />

//           <CommandList>
//             <CommandEmpty>No results found.</CommandEmpty>

//             {options.map((option) => (
//               <CommandItem
//                 key={option.iso2 || option.value || option.key}
//                 value={`${option.label} ${option.value}`}
//                 onSelect={() => {
//                   onChange(option.value);
//                   setOpen(false);
//                 }}
//               >
//                 <div className="flex items-center gap-2 text-xs">
//                   <div className="flex items-center h-6 w-6 ">
//                     <CountryFlag iso2={option.iso2} />
//                   </div>
//                   <p className="inline">{option.label}</p>
//                 </div>

//                 {value === option.value && (
//                   <Check className="ml-auto h-4 w-4" />
//                 )}
//               </CommandItem>
//             ))}
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// };

// export default SearchableSelect;
