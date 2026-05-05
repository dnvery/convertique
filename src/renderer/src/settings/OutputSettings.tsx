import { useAppStore } from '../store';
import { TextArea } from '../components/FormControls';

export function OutputSettings() {
  const config = useAppStore((s) => s.config);
  const setConfig = useAppStore((s) => s.setConfig);

  if (!config) return null;

  const update = (field: string, value: string) => {
    setConfig({
      ...config,
      document: {
        ...config.document,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <TextArea
        label="Output filename template"
        value={config.document.output_name_template || ''}
        onChange={(v) => update('output_name_template', v)}
        placeholder="{{.Title}} - {{.Series}} {{.Number}}"
      />
      
      <TextArea
        label="Stylesheet path (leave empty for default)"
        value={config.document.stylesheet_path || ''}
        onChange={(v) => update('stylesheet_path', v)}
        placeholder="/path/to/style.css"
      />
    </div>
  );
}