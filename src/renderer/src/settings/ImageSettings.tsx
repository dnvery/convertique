import { useAppStore } from '../store';
import { FbcConfig } from '../../../shared/types';
import { Toggle, SliderInput, NumberInput } from '../components/FormControls';

const COVER_RESIZE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'keepAR', label: 'Keep Aspect Ratio' },
  { value: 'stretch', label: 'Stretch' },
] as const;

export function ImageSettings() {
  const config = useAppStore((s) => s.config);
  const setConfig = useAppStore((s) => s.setConfig);

  if (!config) return null;

  const updateImages = (updates: Partial<FbcConfig['document']['images']>) => {
    setConfig({
      ...config,
      document: { ...config.document, images: { ...config.document.images, ...updates } },
    } as FbcConfig);
  };

  const updateCover = (updates: Partial<FbcConfig['document']['images']['cover']>) => {
    setConfig({
      ...config,
      document: {
        ...config.document,
        images: {
          ...config.document.images,
          cover: { ...config.document.images.cover, ...updates },
        },
      },
    } as FbcConfig);
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 text-sm font-medium text-gray-300">Screen</h4>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Width"
            value={config.document.images.screen.width}
            onChange={(v) =>
              updateImages({ screen: { ...config.document.images.screen, width: v } })
            }
            min={400}
          />
          <NumberInput
            label="Height"
            value={config.document.images.screen.height}
            onChange={(v) =>
              updateImages({ screen: { ...config.document.images.screen, height: v } })
            }
            min={600}
          />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-medium text-gray-300">Processing</h4>
        <div className="space-y-2">
          <Toggle
            label="Use broken images"
            checked={config.document.images.use_broken}
            onChange={(v) => updateImages({ use_broken: v })}
          />
          <Toggle
            label="Remove transparency"
            checked={config.document.images.remove_transparency}
            onChange={(v) => updateImages({ remove_transparency: v })}
          />
          <Toggle
            label="Optimize images"
            checked={config.document.images.optimize}
            onChange={(v) => updateImages({ optimize: v })}
          />
          <SliderInput
            label="JPEG Quality (40-100)"
            value={config.document.images.jpeg_quality_level}
            onChange={(v) => updateImages({ jpeg_quality_level: v })}
            min={40}
            max={100}
            showValue
          />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-medium text-gray-300">Cover</h4>
        <div className="space-y-2">
          <Toggle
            label="Generate cover"
            checked={config.document.images.cover.generate}
            onChange={(v) => updateCover({ generate: v })}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Resize</span>
            <select
              value={config.document.images.cover.resize}
              onChange={(e) => updateCover({ resize: e.target.value as 'none' | 'keepAR' | 'stretch' })}
              className="rounded bg-gray-800 px-2 py-1 text-sm text-gray-300"
            >
              {COVER_RESIZE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}