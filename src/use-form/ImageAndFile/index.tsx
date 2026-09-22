'use client'; 

import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import { X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Controller, useFormContext } from 'react-hook-form';

interface ImageAndFileUploaderProps {
  name: string;
  label: string;
  accept?: string[];
  rules?: any;
  disabled?: boolean;
  maxSize?: number;
}

export default function ImageAndFileUploader({
  label = 'Featured Image',
  name,
  accept = [],
  rules,
  disabled = false,
  maxSize = 10 * 1024 * 1024, // 10MB
}: ImageAndFileUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    setError,
    control,
    formState: { errors },
    clearErrors,
  } = useFormContext();

  const isError = errors[name]?.message;

  const processFile = (file: File | null) => {
    if (!file) return;
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (!accept.includes(fileExtension)) {
      setError(name, {
        type: 'manual',
        message: `Unsupported format. Allowed: ${accept.join(', ')}`,
      });
      return;
    }

    if (file.size > maxSize) {
      setError(name, {
        type: 'manual',
        message: `File exceeds ${maxSize / 1024 / 1024} MB`,
      });
      return;
    }

    setFileType(fileExtension);
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearErrors(name);
    const file = e.target.files?.[0] || null;
    processFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    clearErrors(name);
    processFile(e.dataTransfer.files[0] || null);
  };

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className='space-y-2'>
      <label className={cn('font-medium text-sm', isError && '')}>
        {label} {rules?.required && <span className='ml-1'>*</span>}
      </label>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <Controller
            name={name}
            control={control}
            rules={rules}
            render={() => (
              <div
                className={cn(
                  'h-32 border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer transition-colors',
                  isError
                    ? 'border-red-500'
                    : 'border-gray-300 hover:border-primary/50'
                )}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type='file'
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept={accept.map((ext) => `.${ext}`).join(',')}
                  className='hidden'
                  disabled={disabled}
                />
                <Upload className='h-10 w-10 mb-2 text-gray-400' />
                <p className='text-sm text-center'>
                  Drag & drop or click to upload
                </p>
                <p className='text-xs text-muted-foreground'>
                  Max: {maxSize / 1024 / 1024}MB | Formats: {accept.join(', ')}
                </p>
              </div>
            )}
          />

          {isError && typeof isError === 'string' && (
            <p className=' text-sm'>{isError}</p>
          )}
        </div>

        <div className='relative w-full border rounded-md overflow-hidden h-32'>
          {preview ? (
            fileType === 'pdf' ? (
              <div className='flex flex-col items-center justify-center w-full h-full bg-gray-100 p-2'>
                <svg className="w-12 h-12 " viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 18H17V16H7V18Z" fill="currentColor" />
                  <path d="M17 14H7V12H17V14Z" fill="currentColor" />
                  <path d="M7 10H11V8H7V10Z" fill="currentColor" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M6 2C4.34315 2 3 3.34315 3 5V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V9C21 5.13401 17.866 2 14 2H6ZM6 4H13V9H19V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4ZM15 4.10002C16.6113 4.4271 17.9413 5.52906 18.584 7H15V4.10002Z" fill="currentColor" />
                </svg>
                <p className="text-xs text-center text-gray-600 mt-1">{fileName}</p>
                <a href={preview} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 mt-1">View PDF</a>
              </div>
            ) : (
              <img
                src={preview}
                alt="Preview"
                className='w-full h-full object-contain'
              />
            )
          ) : (
            <div className='flex items-center justify-center w-full h-full bg-gray-100'>
              <p className='text-sm text-gray-500'>No file selected</p>
            </div>
          )}
          {preview && (
            <button
              className='absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 
                         text-white flex items-center justify-center text-sm transition-colors'
              onClick={removeImage}
              type='button'
            >
              <X className='h-5 w-5' />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
