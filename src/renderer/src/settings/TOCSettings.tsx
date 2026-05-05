import { useAppStore } from '../store';
import { FbcConfig } from '../../../shared/types';
import { Toggle, TextArea } from '../components/FormControls';

export function TOCSettings() {
  const config = useAppStore((s) => s.config);
  const setConfig = useAppStore((s) => s.setConfig);

  if (!config) return null;

  const updateTocPage = (updates: Partial<FbcConfig['document']['toc_page']>) => {
    setConfig({
      ...config,
      document: { ...config.document, toc_page: { ...config.document.toc_page, ...updates } },
    } as FbcConfig);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Placement</span>
        <select
          value={config.document.toc_page.placement}
          onChange={(e) => updateTocPage({ placement: e.target.value as 'none' | 'before' | 'after' })}
          className="rounded bg-gray-800 px-2 py-1 text-sm text-gray-300"
        >
          <option value="none">None</option>
          <option value="before">Before</option>
          <option value="after">After</option>
        </select>
      </div>

      <TextArea
        label="Authors template"
        value={config.document.toc_page.authors_template}
        onChange={(v) => updateTocPage({ authors_template: v })}
      />

      <Toggle
        label="Include chapters without title"
        checked={config.document.toc_page.include_chapters_without_title}
        onChange={(v) => updateTocPage({ include_chapters_without_title: v })}
      />
    </div>
  );
}