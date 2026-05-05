import { useState } from 'react';

interface WindowWithConvertique extends Window {
  convertique?: {
    selectFiles: () => Promise<{ canceled: boolean; filePaths: string[] }>;
    selectDirectory: () => Promise<{ canceled: boolean; filePaths: string[] }>;
    getSystemInfo: () => Promise<{
      platform: string;
      arch: string;
      fbcPath: string;
      fbcVersion?: string;
    }>;
    convertStart: (tasks: unknown[]) => Promise<unknown>;
    convertCancel: (id: string) => Promise<void>;
    getDefaultConfig: () => Promise<unknown>;
    validateConfig: (config: string) => Promise<unknown>;
    getFbcVersion: () => Promise<string | undefined>;
    openPath: (path: string) => Promise<void>;
    onConvertProgress: (
      callback: (data: { id: string; status: string }) => void,
    ) => () => void;
    onConvertResult: (callback: (data: unknown) => void) => () => void;
  };
}

const api = (window as WindowWithConvertique).convertique;

export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Convertique
        </h1>
        <p className="mt-2 text-gray-400">
          FB2 to EPUB / AZW8 / KFX converter
        </p>
        <p className="mt-4 text-sm text-gray-500">Drop files to get started</p>
      </div>
    </div>
  );
}