import { useAppStore } from '../store';
import { FbcConfig } from '../../../shared/types';
import { Select, TextArea, TextInput } from '../components/FormControls';

const FOOTNOTE_MODE_OPTIONS: { value: 'default' | 'float' | 'floatRenumbered'; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'float', label: 'Float' },
  { value: 'floatRenumbered', label: 'Float Renumbered' },
];

export function FootnotesSettings() {
  const config = useAppStore((s) => s.config);
  const setConfig = useAppStore((s) => s.setConfig);

  if (!config) return null;

  const updateFootnotes = (updates: Partial<FbcConfig['document']['footnotes']>) => {
    setConfig({
      ...config,
      document: { ...config.document, footnotes: { ...config.document.footnotes, ...updates } },
    } as FbcConfig);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Mode</span>
        <Select
          value={config.document.footnotes.mode}
          onChange={(v) => updateFootnotes({ mode: v })}
          options={FOOTNOTE_MODE_OPTIONS}
        />
      </div>

      <TextInput
        label="Note bodies (comma-separated)"
        value={config.document.footnotes.bodies.join(', ')}
        onChange={(v) => updateFootnotes({ bodies: v.split(',').map((s) => s.trim()) })}
        placeholder="notes, comments"
      />

      <TextInput
        label="Backlinks"
        value={config.document.footnotes.backlinks}
        onChange={(v) => updateFootnotes({ backlinks: v })}
      />

      <TextInput
        label="More paragraphs"
        value={config.document.footnotes.more_paragraphs}
        onChange={(v) => updateFootnotes({ more_paragraphs: v })}
      />

      <TextArea
        label="Label template"
        value={config.document.footnotes.label_template}
        onChange={(v) => updateFootnotes({ label_template: v })}
      />
    </div>
  );
}