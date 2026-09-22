// import { useRef, type ChangeEvent, type DragEvent, useState } from 'react';
// import get from 'lodash/get';
// import { X, Upload } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { Controller, useFormContext } from 'react-hook-form';
// import useMultiplePresignedUrl from '@/modules/FileUpload/useMultiplePresignedUrl';
// import useMultipleFileUpload from '@/modules/FileUpload/useMultipleFileUpload';
// import useGetMultipleFileUrl from '@/modules/FileUpload/useGetMultipleFileUrl';

// interface MultiImageUploaderProps {
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

// export default function MultiImageUploader({
//   label = 'Featured Images',
//   name,
//   accept = [],
//   rules,
//   disabled = false,
//   maxSize = 5 * 1024 * 1024,
//   meta,
// }: MultiImageUploaderProps) {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const {
//     setError,
//     control,
//     formState: { errors },
//     clearErrors,
//     watch,
//     setValue,
//   } = useFormContext();

//   const files: string[] = watch(name) || [];

//   const error = get(errors, name)?.message as string;

//   const { mutateAsync: getMultiplePresignedUrl } = useMultiplePresignedUrl();
//   const { mutateAsync: uploadFile } = useMultipleFileUpload();
//   const { mutateAsync: getFileUrl } = useGetMultipleFileUrl();

//   const processFiles = async (selectedFiles: File[]) => {
//     const fileInputs = selectedFiles.map((file) => ({
//       fileName: file.name,
//       mimeType: file.type,
//       fileSize: file.size,
//       refId: meta?.refId || '',
//       belongsTo: meta?.belongsTo || '',
//       isPublic: meta?.isPublic || false,
//       metadata: {}, 
//     }));

//     try {
//       const presignedResponses = await getMultiplePresignedUrl(fileInputs);
//       console.log(presignedResponses, 'presignedResponses');
//       const uploadedUrls: string[] = [];

//       await Promise.all(
//         (presignedResponses as any).data.map(async (res: any, index: number) => {
//           await uploadFile({ url: res.uploadUrl, file: selectedFiles[index] });
//           const fileUrlRes = await getFileUrl(res.assetS3Object._id);
//           uploadedUrls.push(fileUrlRes.s3Url ?? fileUrlRes.url ?? fileUrlRes.data?.url);
//         })
//       );

//       if (uploadedUrls.length > 0) {
//         setValue(name, [...files, ...uploadedUrls]);
//         clearErrors(name);
//       }
//     } catch (error) {
//       setError(name, {
//         type: 'manual',
//         message: 'Upload failed. Try again.',
//       });
//     }
//   };


//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     clearErrors(name);
//     const selectedFiles = Array.from(e.target.files || []);
//     processFiles(selectedFiles);
//   };

//   const handleDrop = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     clearErrors(name);
//     const droppedFiles = Array.from(e.dataTransfer.files || []);
//     processFiles(droppedFiles);
//   };

//   const removeImage = (index: number) => {
//     const updated = [...files];
//     updated.splice(index, 1);
//     setValue(name, updated);
//     if (fileInputRef.current) fileInputRef.current.value = '';
//   };

//   return (
//     <div className="space-y-2">
//       <label
//         htmlFor={name}
//         className={cn('text-sm font-medium', error && 'text-destructive')}
//       >
//         {label} {rules?.required && <span className="ml-1 text-destructive">*</span>}
//       </label>

//       <div className="grid gap-4">
//         <Controller
//           name={name}
//           control={control}
//           rules={rules}
//           render={() => (
//             <div
//               className={cn(
//                 'h-32 border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer transition-colors',
//                 error && 'border-destructive'
//               )}
//               onDragOver={(e) => e.preventDefault()}
//               onDrop={handleDrop}
//               onClick={() => fileInputRef.current?.click()}
//             >
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//                 accept={accept.map((ext) => `.${ext}`).join(',')}
//                 className="hidden"
//                 multiple
//                 disabled={disabled}
//               />
//               <Upload className="h-10 w-10 mb-2 text-gray-400" />
//               <p className="text-sm text-center">Drag & drop or click to upload</p>
//               <p className="text-xs text-muted-foreground">
//                 Max: {maxSize / 1024 / 1024}MB | Formats: {accept.join(', ')}
//               </p>
//             </div>
//           )}
//         />
//         {error && (
//           <p id={`${name}-error`} className="text-sm text-destructive mt-1">
//             {error}
//           </p>
//         )}

//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//           {files.length > 0 ? (
//             files.map((url, index) => (
//               <div key={index} className="relative border rounded-md h-32 overflow-hidden">
//                 <img src={url} alt={`Uploaded ${index}`} className="w-full h-full object-contain" />
//                 <button
//                   type="button"
//                   className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center"
//                   onClick={() => removeImage(index)}
//                 >
//                   <X className="h-5 w-5" />
//                 </button>
//               </div>
//             ))
//           ) : (
//             <div className="flex items-center justify-center w-full h-32 bg-gray-100 rounded-md col-span-full">
//               <p className="text-sm text-gray-500">No images uploaded</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
