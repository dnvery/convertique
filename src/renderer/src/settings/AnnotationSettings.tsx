import { useAppStore } from '../store';
import { FbcConfig } from '../../../shared/types';
import { Toggle, TextInput } from '../components/FormControls';

export function AnnotationSettings() {
  const config = useAppStore((s) => s.config);
  const setConfig = useAppStore((s) => s.setConfig);

  if (!config) return null;

  const updateAnnotation = (updates: Partial<FbcConfig['document']['annotation']>) => {
    setConfig({
      ...config,
      document: { ...config.document, annotation: { ...config.document.annotation, ...updates } },
    } as FbcConfig);
  };

  return (
    <div className="space-y-4">
      <Toggle
        label="Include annotation"
        checked={config.document.annotation.enable}
        onChange={(v) => updateAnnotation({ enable: v })}
      />
      <TextInput
        label="Title"
        value={config.document.annotation.title}
        onChange={(v) => updateAnnotation({ title: v })}
      />
      <Toggle
        label="Show in TOC"
        checked={config.document.annotation.in_toc}
        onChange={(v) => updateAnnotation({ in_toc: v })}
      />
    </div>
  );
}