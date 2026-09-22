

// import { useRef, type ChangeEvent, type DragEvent, useState } from 'react';
// import get from 'lodash/get';
// import { X, Upload } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { Controller, useFormContext } from 'react-hook-form';
// import useSinglePresignedUrl from "@/modules/FileUpload/useSinglePresignedUrl";
// import useSingleFileUpload from "@/modules/FileUpload/useSingleFileUpload";
// import useGetSingleFileUrl from "@/modules/FileUpload/useGetSingleFileUrl";

// interface ImageUploaderProps {
//   name: string;
//   label: string;
//   accept?: string[];
//   rules?: any;
//   disabled?: boolean;
//   maxSize?: number;
//   meta?: {
//     refId: string;
//     belongsTo: string;
//     isPublic: boolean;
//   };
// }

// export default function ImageUploader({
//   label = "Featured Image",
//   name,
//   accept = [],
//   rules,
//   disabled = false,
//   maxSize = 5 * 1024 * 1024,
//   meta,
// }: ImageUploaderProps) {
//   const { getSinglePresignedUrl } = useSinglePresignedUrl();
//   const { uploadFile } = useSingleFileUpload();
//   const { getFileUrl } = useGetSingleFileUrl();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const {
//     setError,
//     control,
//     formState: { errors },
//     clearErrors,
//     watch,
//     setValue,
//   } = useFormContext();
//   const file = watch(name);
//   const processFile = async (file: File | null) => {
//     if (!file) return;

//     if (!accept.includes(file.type.split("/")[1])) {
//       setError(name, {
//         type: "manual",
//         message: `Unsupported format. Allowed: ${accept.join(", ")}`,
//       });
//       return;
//     }

//     if (file.size > maxSize) {
//       setError(name, {
//         type: "manual",
//         message: `File exceeds ${maxSize / 1024 / 1024} MB`,
//       });
//       return;
//     }
//     await getSinglePresignedUrl({
//       fileName: file.name,
//       mimeType: file.type,
//       fileSize: file.size,
//       refId: meta?.refId || "",
//       belongsTo: meta?.belongsTo || "",
//       isPublic: meta?.isPublic || false,
//     }).then(async (res: any) => {
//       await uploadFile({ url: res.data?.uploadUrl, file }).then(async (r: any) => {
//         console.log(res.data.assetS3Object._id);
//         if (r.status === 200) {
//           await getFileUrl(res.data?.assetS3Object?._id).then((fileReponse: any) => {
//             setValue(name, fileReponse.data.url);
//             console.log(fileReponse.data.url);
//           });
//         }
//       });
//     });
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     clearErrors(name);
//     const file = e.target.files?.[0] || null;
//     processFile(file);
//   };

//   const handleDrop = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     clearErrors(name);
//     processFile(e.dataTransfer.files[0] || null);
//   };

//   const removeImage = () => {
//     setValue(name, null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const error = get(errors, name)?.message as string;

//   return (
//     <div className="space-y-2">
//       <label
//         htmlFor={name}
//         className={cn("text-sm font-medium", error && "text-destructive")}
//       >
//         {label} {rules?.required && <span className="ml-1 text-destructive">*</span>}
//       </label>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <Controller
//             name={name}
//             control={control}
//             rules={rules}
//             render={() => (
//               <div
//                 className={cn(
//                   "h-32 border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
//                   errors[name] && "border-destructive",
//                   error && "border-destructive",
//                 )}
//                 onDragOver={(e) => e.preventDefault()}
//                 onDrop={handleDrop}
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleFileChange}
//                   accept={accept.map((ext) => `.${ext}`).join(",")}
//                   className="hidden"
//                   disabled={disabled}
//                 />
//                 <Upload className="h-10 w-10 mb-2 text-gray-400" />
//                 <p className="text-sm text-center">
//                   Drag & drop or click to upload
//                 </p>
//                 <p className="text-xs text-muted-foreground">
//                   Max: {maxSize / 1024 / 1024}MB | Formats: {accept.join(", ")}
//                 </p>
//               </div>
//             )}
//           />
//           {error && (
//             <p id={`${name}-error`} className="text-sm text-destructive mt-1">
//               {error}
//             </p>
//           )}
//         </div>

//         <div className="relative w-full border rounded-md overflow-hidden h-32">
//           {file ? (
//             <img
//               src={file || ""}
//               alt="Preview"
//               className="w-full h-full object-contain"
//             />
//           ) : (
//             <div className="flex items-center justify-center w-full h-full bg-gray-100">
//               <p className="text-sm text-gray-500">No image selected</p>
//             </div>
//           )}
//           {file && (
//             <button
//               className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 
//                          text-white flex items-center justify-center text-sm transition-colors"
//               onClick={removeImage}
//               type="button"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
