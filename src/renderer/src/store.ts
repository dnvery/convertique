import { create } from 'zustand';
import { ConversionTask, ConversionResult, OutputFormat, FbcConfig } from '../../shared/types';

interface FileItem {
  id: string;
  path: string;
  name: string;
  status: ConversionTask['id'] extends never ? never : ConversionResult['status'];
}

interface AppState {
  files: FileItem[];
  selectedFormat: OutputFormat;
  outputDirectory: string | null;
  config: FbcConfig | null;
  fbcVersion: string | null;
  isConverting: boolean;

  addFiles: (paths: string[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  setSelectedFormat: (format: OutputFormat) => void;
  setOutputDirectory: (dir: string) => void;
  setConfig: (config: FbcConfig | null) => void;
  setFbcVersion: (version: string | null) => void;
  setIsConverting: (converting: boolean) => void;
  updateFileStatus: (id: string, status: FileItem['status']) => void;
}

const getFileName = (path: string): string => {
  const parts = path.replace(/\\/g, '/').split('/');
  return parts[parts.length - 1] || path;
};

export const useAppStore = create<AppState>((set, get) => ({
  files: [],
  selectedFormat: 'epub3',
  outputDirectory: null,
  config: null,
  fbcVersion: null,
  isConverting: false,

  addFiles: (paths) => {
    const newFiles = paths
      .filter((p) => !get().files.some((f) => f.path === p))
      .map((path) => ({
        id: crypto.randomUUID(),
        path,
        name: getFileName(path),
        status: 'pending' as const,
      }));
    set((state) => ({ files: [...state.files, ...newFiles] }));
  },

  removeFile: (id) => {
    set((state) => ({ files: state.files.filter((f) => f.id !== id) }));
  },

  clearFiles: () => {
    set({ files: [] });
  },

  setSelectedFormat: (format) => {
    set({ selectedFormat: format });
  },

  setOutputDirectory: (dir) => {
    set({ outputDirectory: dir });
  },

  setConfig: (config) => {
    set({ config });
  },

  setFbcVersion: (version) => {
    set({ fbcVersion: version });
  },

  setIsConverting: (converting) => {
    set({ isConverting: converting });
  },

  updateFileStatus: (id, status) => {
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, status } : f)),
    }));
  },
}));