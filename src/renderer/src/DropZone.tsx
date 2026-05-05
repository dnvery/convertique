import { useCallback, useState, useEffect } from 'react';
import { useAppStore } from './store';
import { ensureApi } from './api';

export function DropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const addFiles = useAppStore((s) => s.addFiles);
  const isConverting = useAppStore((s) => s.isConverting);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const items = Array.from(e.dataTransfer.files);
      const paths: string[] = [];

      for (const item of items) {
        const file = item as File & { path?: string };
        if (file.path) {
          paths.push(file.path);
        }
      }

      if (paths.length > 0) {
        addFiles(paths);
      }
    },
    [addFiles],
  );

  const handleClick = useCallback(async () => {
    if (isConverting) return;

    try {
      const result = await ensureApi().selectFiles();
      if (!result.canceled && result.filePaths.length > 0) {
        addFiles(result.filePaths);
      }
    } catch {
      // ignore errors
    }
  }, [addFiles, isConverting]);

  useEffect(() => {
    const handleDragOverWindow = (e: DragEvent) => {
      e.preventDefault();
    };
    const handleDropWindow = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener('dragover', handleDragOverWindow);
    window.addEventListener('drop', handleDropWindow);

    return () => {
      window.removeEventListener('dragover', handleDragOverWindow);
      window.removeEventListener('drop', handleDropWindow);
    };
  }, []);

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        flex h-48 w-full cursor-pointer flex-col items-center justify-center
        rounded-lg border-2 border-dashed transition-colors
        ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
        }
        ${isConverting ? 'cursor-not-allowed opacity-50' : ''}
      `}
    >
      <div className="text-center">
        <div className="mb-2 text-4xl">+</div>
        <p className="text-sm text-gray-400">
          {isDragging ? 'Drop files here' : 'Click to select or drag & drop FB2 files'}
        </p>
        <p className="mt-1 text-xs text-gray-500">Supports .fb2 and .zip archives</p>
      </div>
    </div>
  );
}