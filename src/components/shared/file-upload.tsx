'use client';

import { useCallback, useState } from 'react';
import { Upload, X, FileIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  category?: string;
  existingFiles?: { id: string; fileName: string; fileSize: number }[];
  onRemove?: (fileId: string) => void;
}

export function FileUpload({ onUpload, maxFiles = 10, existingFiles = [], onRemove }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = useCallback((files: File[]): File[] => {
    setError(null);
    const valid: File[] = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`${file.name}: File type not supported. Please upload PDF, JPG, PNG, TIFF, or DOC files.`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        setError(`${file.name}: File is too large. Maximum size is 10MB.`);
        continue;
      }
      valid.push(file);
    }

    if (existingFiles.length + valid.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed.`);
      return valid.slice(0, maxFiles - existingFiles.length);
    }

    return valid;
  }, [existingFiles.length, maxFiles]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const files = validateFiles(Array.from(e.dataTransfer.files));
      if (files.length) onUpload(files);
    },
    [onUpload, validateFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const files = validateFiles(Array.from(e.target.files));
      if (files.length) onUpload(files);
      e.target.value = '';
    },
    [onUpload, validateFiles]
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          dragActive ? 'border-brand-teal bg-brand-teal/5' : 'border-muted-foreground/25 hover:border-brand-teal/50'
        )}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
        <p className="text-sm font-medium">Drag and drop files here, or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG, TIFF, DOC up to 10MB each</p>
        <input id="file-input" type="file" className="hidden" multiple accept=".pdf,.jpg,.jpeg,.png,.tiff,.doc,.docx" onChange={handleChange} />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {existingFiles.length > 0 && (
        <ul className="space-y-2">
          {existingFiles.map((file) => (
            <li key={file.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2">
                <FileIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{file.fileName}</span>
                <span className="text-xs text-muted-foreground">{formatSize(file.fileSize)}</span>
              </div>
              {onRemove && (
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRemove(file.id)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
