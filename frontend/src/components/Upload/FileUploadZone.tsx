import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadZoneProps {
  accept: string;
  onUpload: (file: File) => void;
  isLoading?: boolean;
  error?: string;
  uploadedFile?: string;
}

export default function FileUploadZone({
  accept,
  onUpload,
  isLoading = false,
  error,
  uploadedFile,
}: FileUploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.split(',').reduce((acc, ext) => {
      acc[ext.trim()] = [];
      return acc;
    }, {} as Record<string, string[]>),
    multiple: false,
    disabled: isLoading,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all"
        style={{
          borderColor: isDragActive 
            ? 'rgba(127,224,255,.50)' 
            : error 
            ? 'rgba(255,122,138,.40)' 
            : 'rgba(255,255,255,.20)',
          background: isDragActive
            ? 'rgba(127,224,255,.08)'
            : error
            ? 'rgba(255,122,138,.08)'
            : 'rgba(0,0,0,.14)',
          opacity: isLoading ? 0.5 : 1,
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <div style={{ color: 'rgba(255,255,255,.66)' }}>Uploading...</div>
        ) : uploadedFile ? (
          <div style={{ color: '#77f2c1' }}>
            <svg
              className="mx-auto h-12 w-12 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm font-medium">{uploadedFile}</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,.45)' }}>Click to replace</p>
          </div>
        ) : (
          <div style={{ color: 'rgba(255,255,255,.66)' }}>
            <svg
              className="mx-auto h-12 w-12 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ opacity: 0.6 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm">
              {isDragActive
                ? 'Drop the file here'
                : 'Drag & drop a file here, or click to select'}
            </p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,.45)' }}>Accepted: {accept}</p>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm" style={{ color: '#ff7a8a' }}>{error}</p>
      )}
    </div>
  );
}
