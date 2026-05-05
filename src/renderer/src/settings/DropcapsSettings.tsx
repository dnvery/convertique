import { useAppStore } from '../store';
import { FbcConfig } from '../../../shared/types';
import { Toggle, TextInput } from '../components/FormControls';

export function DropcapsSettings() {
  const config = useAppStore((s) => s.config);
  const setConfig = useAppStore((s) => s.setConfig);

  if (!config) return null;

  const updateDropcaps = (updates: Partial<FbcConfig['document']['dropcaps']>) => {
    setConfig({
      ...config,
      document: { ...config.document, dropcaps: { ...config.document.dropcaps, ...updates } },
    } as FbcConfig);
  };

  return (
    <div className="space-y-4">
      <Toggle
        label="Enable drop caps"
        checked={config.document.dropcaps.enable}
        onChange={(v) => updateDropcaps({ enable: v })}
      />
      <TextInput
        label="Ignore symbols"
        value={config.document.dropcaps.ignore_symbols || ''}
        onChange={(v) => updateDropcaps({ ignore_symbols: v })}
        placeholder="'-.…)
123..."
      />
    </div>
  );
}