export type OutputFormat = 'epub2' | 'epub3' | 'kepub' | 'kfx' | 'azw8';

export interface ConversionTask {
  id: string;
  sourcePath: string;
  destinationPath: string;
  format: OutputFormat;
  asin?: string;
  ebook?: boolean;
  overwrite?: boolean;
  noDirs?: boolean;
  forceZipCp?: string;
}

export type ConversionStatus = 'pending' | 'converting' | 'done' | 'error' | 'cancelled';

export interface ConversionResult {
  id: string;
  status: ConversionStatus;
  outputPath?: string;
  error?: string;
  duration?: number;
}

export interface SystemInfo {
  platform: string;
  arch: string;
  fbcPath: string;
  fbcVersion?: string;
}

export const OUTPUT_FORMATS: { value: OutputFormat; label: string }[] = [
  { value: 'epub2', label: 'EPUB 2' },
  { value: 'epub3', label: 'EPUB 3' },
  { value: 'kepub', label: 'KEPUB (Kobo)' },
  { value: 'kfx', label: 'KFX (Kindle)' },
  { value: 'azw8', label: 'AZW8 (Kindle)' },
];

export const IPC_CHANNELS = {
  SELECT_FILES: 'select-files',
  SELECT_DIRECTORY: 'select-directory',
  GET_SYSTEM_INFO: 'get-system-info',
  CONVERT_START: 'convert-start',
  CONVERT_CANCEL: 'convert-cancel',
  CONVERT_PROGRESS: 'convert-progress',
  CONVERT_RESULT: 'convert-result',
  CONVERT_QUEUE_RESULT: 'convert-queue-result',
  GET_DEFAULT_CONFIG: 'get-default-config',
  VALIDATE_CONFIG: 'validate-config',
  GET_FBC_VERSION: 'get-fbc-version',
  OPEN_PATH: 'open-path',
} as const;