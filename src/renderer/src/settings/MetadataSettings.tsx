import { useAppStore } from '../store';
import { FbcConfig } from '../../../shared/types';
import { Toggle, TextArea } from '../components/FormControls';

export function MetadataSettings() {
  const config = useAppStore((s) => s.config);
  const setConfig = useAppStore((s) => s.setConfig);

  if (!config) return null;

  const updateMeta = (updates: Partial<FbcConfig['document']['metainformation']>) => {
    setConfig({
      ...config,
      document: { ...config.document, metainformation: { ...config.document.metainformation, ...updates } },
    } as FbcConfig);
  };

  return (
    <div className="space-y-4">
      <TextArea
        label="Title template"
        value={config.document.metainformation.title_template}
        onChange={(v) => updateMeta({ title_template: v })}
      />
      <TextArea
        label="Creator name template"
        value={config.document.metainformation.creator_name_template}
        onChange={(v) => updateMeta({ creator_name_template: v })}
      />
      <Toggle
        label="Transliterate metadata"
        checked={config.document.metainformation.transliterate}
        onChange={(v) => updateMeta({ transliterate: v })}
      />
    </div>
  );
}