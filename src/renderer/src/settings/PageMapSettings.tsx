import { useAppStore } from '../store';
import { FbcConfig } from '../../../shared/types';
import { Toggle, NumberInput } from '../components/FormControls';

export function PageMapSettings() {
  const config = useAppStore((s) => s.config);
  const setConfig = useAppStore((s) => s.setConfig);

  if (!config) return null;

  const updatePageMap = (updates: Partial<FbcConfig['document']['page_map']>) => {
    setConfig({
      ...config,
      document: { ...config.document, page_map: { ...config.document.page_map, ...updates } },
    } as FbcConfig);
  };

  return (
    <div className="space-y-4">
      <Toggle
        label="Enable page map"
        checked={config.document.page_map.enable}
        onChange={(v) => updatePageMap({ enable: v })}
      />
      <NumberInput
        label="Size (min 500)"
        value={config.document.page_map.size || 0}
        onChange={(v) => updatePageMap({ size: v })}
        min={500}
      />
      <Toggle
        label="Adobe DE"
        checked={config.document.page_map.adobe_de}
        onChange={(v) => updatePageMap({ adobe_de: v })}
      />
    </div>
  );
}