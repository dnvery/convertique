import { useAppStore } from '../store';
import { FbcConfig } from '../../../shared/types';
import { Toggle, Select } from '../components/FormControls';

const TOC_OPTIONS: { value: 'normal' | 'old_kindle' | 'flat'; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'old_kindle', label: 'Old Kindle' },
  { value: 'flat', label: 'Flat' },
];

export function GeneralSettings() {
  const config = useAppStore((s) => s.config);
  const setConfig = useAppStore((s) => s.setConfig);

  if (!config) return null;

  const update = (updates: Partial<FbcConfig['document']>) => {
    setConfig({ ...config, document: { ...config.document, ...updates } } as FbcConfig);
  };

  return (
    <div className="space-y-4">
      <Toggle
        label="Fix ZIP (old format)"
        checked={config.document.fix_zip}
        onChange={(v) => update({ fix_zip: v })}
      />
      <Toggle
        label="Open from cover page"
        checked={config.document.open_from_cover}
        onChange={(v) => update({ open_from_cover: v })}
      />
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">TOC Type</span>
        <Select
          value={config.document.toc_type}
          onChange={(v) => update({ toc_type: v })}
          options={TOC_OPTIONS}
        />
      </div>
      <Toggle
        label="Transliterate filename"
        checked={config.document.file_name_transliterate}
        onChange={(v) => update({ file_name_transliterate: v })}
      />
      <Toggle
        label="Insert soft hyphens"
        checked={config.document.insert_soft_hyphen}
        onChange={(v) => update({ insert_soft_hyphen: v })}
      />
    </div>
  );
}