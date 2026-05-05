import { useAppStore } from '../store';
import { FbcConfig } from '../../../shared/types';
import { Toggle, TextInput } from '../components/FormControls';

export function TextTransformSettings() {
  const config = useAppStore((s) => s.config);
  const setConfig = useAppStore((s) => s.setConfig);

  if (!config) return null;

  const updateTransform = (
    key: 'speech' | 'dashes' | 'dialogue',
    updates: Partial<FbcConfig['document']['text_transformations']['speech']>,
  ) => {
    setConfig({
      ...config,
      document: {
        ...config.document,
        text_transformations: {
          ...config.document.text_transformations,
          [key]: { ...config.document.text_transformations[key], ...updates },
        },
      },
    } as FbcConfig);
  };

  const transforms = [
    { key: 'speech' as const, label: 'Speech' },
    { key: 'dashes' as const, label: 'Dashes' },
    { key: 'dialogue' as const, label: 'Dialogue' },
  ];

  return (
    <div className="space-y-8">
      {transforms.map(({ key, label }) => (
        <div key={key} className="pb-4 border-b border-gray-700">
          <h4 className="mb-3 text-sm font-medium text-gray-300">{label}</h4>
          <div className="space-y-3">
            <Toggle
              label="Enable"
              checked={config.document.text_transformations[key].enable}
              onChange={(v) => updateTransform(key, { enable: v })}
            />
            <TextInput
              label="From"
              value={config.document.text_transformations[key].from || ''}
              onChange={(v) => updateTransform(key, { from: v })}
            />
            <TextInput
              label="To"
              value={config.document.text_transformations[key].to || ''}
              onChange={(v) => updateTransform(key, { to: v })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}