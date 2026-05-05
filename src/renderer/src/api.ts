import { ConversionTask, FbcConfig, ConversionResult } from '../../shared/types';

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
    getDefaultConfig: () => Promise<FbcConfig>;
    validateConfig: (configYaml: string) => Promise<{ valid: boolean; errors: string[] }>;
    convertStart: (tasks: ConversionTask[], config: FbcConfig) => Promise<void>;
    convertCancel: (id: string) => Promise<void>;
    openPath: (path: string) => Promise<void>;
    onConvertProgress: (
      callback: (data: { id: string; status: string }) => void,
    ) => () => void;
    onConvertResult: (callback: (data: ConversionResult) => void) => () => void;
  };
}

export const api = (window as WindowWithConvertique).convertique;

export function ensureApi() {
  if (!api) {
    throw new Error('Convertique API not available');
  }
  return api;
}