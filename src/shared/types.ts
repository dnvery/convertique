import { z } from 'zod';

export type OutputFormat = 'epub2' | 'epub3' | 'kepub' | 'kfx' | 'azw8';

export type ConversionStatus = 'pending' | 'converting' | 'done' | 'error' | 'cancelled';

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
  GET_DEFAULT_CONFIG: 'get-default-config',
  VALIDATE_CONFIG: 'validate-config',
  CONVERT_START: 'convert-start',
  CONVERT_CANCEL: 'convert-cancel',
  CONVERT_PROGRESS: 'convert-progress',
  CONVERT_RESULT: 'convert-result',
  OPEN_PATH: 'open-path',
} as const;

const FootnotesModeSchema = z.enum(['default', 'float', 'floatRenumbered']);
const ImageResizeModeSchema = z.enum(['none', 'keepAR', 'stretch']);
const TOCTypeSchema = z.enum(['normal', 'old_kindle', 'flat']);
const TOCPagePlacementSchema = z.enum(['none', 'before', 'after']);

const TextTransformSchema = z.object({
  enable: z.boolean(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export const FbcConfigSchema = z.object({
  version: z.literal(1),
  document: z.object({
    fix_zip: z.boolean(),
    open_from_cover: z.boolean(),
    toc_type: TOCTypeSchema,
    stylesheet_path: z.string().optional(),
    output_name_template: z.string(),
    file_name_transliterate: z.boolean(),
    insert_soft_hyphen: z.boolean(),
    images: z.object({
      use_broken: z.boolean(),
      remove_transparency: z.boolean(),
      scale_factor: z.number().min(0),
      optimize: z.boolean(),
      jpeg_quality_level: z.number().min(40).max(100),
      screen: z.object({
        width: z.number().min(400),
        height: z.number().min(600),
      }),
      cover: z.object({
        generate: z.boolean(),
        default_image_path: z.string().optional(),
        resize: ImageResizeModeSchema,
      }),
    }),
    footnotes: z.object({
      mode: FootnotesModeSchema,
      bodies: z.array(z.string()),
      backlinks: z.string(),
      more_paragraphs: z.string(),
      label_template: z.string(),
    }),
    annotation: z.object({
      enable: z.boolean(),
      title: z.string(),
      in_toc: z.boolean(),
    }),
    toc_page: z.object({
      placement: TOCPagePlacementSchema,
      authors_template: z.string(),
      include_chapters_without_title: z.boolean(),
    }),
    metainformation: z.object({
      title_template: z.string(),
      creator_name_template: z.string(),
      transliterate: z.boolean(),
    }),
    vignettes: z.object({
      book: z.object({
        title_top: z.string().optional(),
        title_bottom: z.string().optional(),
      }),
      chapter: z.object({
        title_top: z.string().optional(),
        title_bottom: z.string().optional(),
        end: z.string().optional(),
      }),
      section: z.object({
        title_top: z.string().optional(),
      }),
    }),
    dropcaps: z.object({
      enable: z.boolean(),
      ignore_symbols: z.string().optional(),
    }),
    page_map: z.object({
      enable: z.boolean(),
      size: z.number().min(500).optional(),
      adobe_de: z.boolean(),
    }),
    text_transformations: z.object({
      speech: TextTransformSchema,
      dashes: TextTransformSchema,
      dialogue: TextTransformSchema,
    }),
  }),
  logging: z.object({
    file: z.object({
      level: z.enum(['none', 'normal', 'debug']),
      destination: z.string().optional(),
      mode: z.enum(['append', 'overwrite']).optional(),
    }),
    console: z.object({
      level: z.enum(['none', 'normal', 'debug']),
    }),
  }),
  reporting: z.object({
    destination: z.string().optional(),
  }),
});

export type FbcConfig = z.infer<typeof FbcConfigSchema>;

export function getDefaultConfig(): FbcConfig {
  return {
    version: 1,
    document: {
      fix_zip: false,
      open_from_cover: false,
      toc_type: 'normal',
      output_name_template: '',
      file_name_transliterate: false,
      insert_soft_hyphen: false,
      images: {
        use_broken: false,
        remove_transparency: false,
        scale_factor: 1.0,
        optimize: true,
        jpeg_quality_level: 95,
        screen: { width: 1264, height: 1680 },
        cover: {
          generate: false,
          resize: 'stretch',
        },
      },
      footnotes: {
        mode: 'float',
        bodies: ['notes', 'comments', '\u043F\u0440\u0438\u043C\u0435\u0447\u0430\u043D\u0438\u044F', '\u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438'],
        backlinks: '[<]',
        more_paragraphs: '(~)\u00A0',
        label_template: '',
      },
      annotation: {
        enable: false,
        title: 'Annotation',
        in_toc: true,
      },
      toc_page: {
        placement: 'none',
        authors_template: '',
        include_chapters_without_title: false,
      },
      metainformation: {
        title_template: '',
        creator_name_template: '',
        transliterate: false,
      },
      vignettes: {
        book: { title_top: 'builtin', title_bottom: 'builtin' },
        chapter: { title_top: 'builtin', title_bottom: 'builtin', end: 'builtin' },
        section: { title_top: 'builtin' },
      },
      dropcaps: {
        enable: false,
        ignore_symbols: '\'"\\-.…0123456789\u2013\u2014\u2015\u00AB\u00BB\u00AB\u00BB<>',
      },
      page_map: {
        enable: true,
        size: 2300,
        adobe_de: false,
      },
      text_transformations: {
        speech: { enable: true, from: '\u2010\u2011\u2013\u2014\u2015', to: '\u2014 ' },
        dashes: { enable: true, from: '\u2010\u2011\u2013\u2014\u2015', to: '\u2014' },
        dialogue: { enable: true, from: '\u2010\u2011\u2013\u2014\u2015', to: ' ' },
      },
    },
    logging: {
      file: { level: 'debug', destination: 'fb2cng.log', mode: 'overwrite' },
      console: { level: 'normal' },
    },
    reporting: { destination: 'fb2cng-report.zip' },
  };
}

export const DEVICE_PRESETS = {
  generic: {
    label: 'Generic',
    config: { images: { screen: { width: 1264, height: 1680 } } },
    defaultFormat: 'epub3' as OutputFormat,
  },
  kindle_paperwhite: {
    label: 'Kindle Paperwhite',
    config: { toc_type: 'old_kindle' as const, images: { screen: { width: 1264, height: 1680 } } },
    defaultFormat: 'azw8' as OutputFormat,
  },
  kindle_oasis: {
    label: 'Kindle Oasis',
    config: { toc_type: 'old_kindle' as const, images: { screen: { width: 1680, height: 2520 } } },
    defaultFormat: 'azw8' as OutputFormat,
  },
  kobo: {
    label: 'Kobo',
    config: { images: { screen: { width: 1264, height: 1680 }, cover: { resize: 'keepAR' as const } } },
    defaultFormat: 'kepub' as OutputFormat,
  },
} as const;

export type DevicePresetKey = keyof typeof DEVICE_PRESETS;