import { useState } from 'react';
import { useAppStore } from './store';
import { DEVICE_PRESETS, DevicePresetKey, OUTPUT_FORMATS, FbcConfig } from '../../shared/types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const config = useAppStore((s) => s.config);
  const setConfig = useAppStore((s) => s.setConfig);
  const selectedFormat = useAppStore((s) => s.selectedFormat);
  const setSelectedFormat = useAppStore((s) => s.setSelectedFormat);

  const [activePreset, setActivePreset] = useState<DevicePresetKey | null>(null);
  const [activeTab, setActiveTab] = useState('device');

  if (!isOpen) return null;

  const handlePresetSelect = (presetKey: DevicePresetKey) => {
    setActivePreset(presetKey);
    const preset = DEVICE_PRESETS[presetKey];
    setSelectedFormat(preset.defaultFormat);
    if (config) {
      setConfig({ ...config, ...preset.config } as FbcConfig);
    }
  };

  const tabs = [
    { id: 'device', label: 'Device' },
    { id: 'images', label: 'Images' },
    { id: 'output', label: 'Output' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="h-[80vh] w-[90vw] max-w-3xl rounded-lg bg-gray-900 p-6">
        <div className="flex items-center justify-between border-b border-gray-700 pb-4">
          <h2 className="text-lg font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            &times;
          </button>
        </div>

        <div className="flex gap-4 border-b border-gray-700 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 text-sm ${
                activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-4">
          {activeTab === 'device' && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Device Preset
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(Object.keys(DEVICE_PRESETS) as DevicePresetKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => handlePresetSelect(key)}
                      className={`rounded-lg p-3 text-sm font-medium transition-colors ${
                        activePreset === key
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {DEVICE_PRESETS[key].label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Output Format
                </label>
                <div className="flex flex-wrap gap-2">
                  {OUTPUT_FORMATS.map((format) => (
                    <button
                      key={format.value}
                      onClick={() => setSelectedFormat(format.value)}
                      className={`rounded-lg px-3 py-1.5 text-sm ${
                        selectedFormat === format.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'images' && config && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs text-gray-400">
                    Screen Width
                  </label>
                  <input
                    type="number"
                    value={config.document.images.screen.width}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        document: {
                          ...config.document,
                          images: {
                            ...config.document.images,
                            screen: {
                              ...config.document.images.screen,
                              width: parseInt(e.target.value) || 1264,
                            },
                          },
                        },
                      } as FbcConfig)
                    }
                    className="w-full rounded bg-gray-800 px-2 py-1 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-400">
                    Screen Height
                  </label>
                  <input
                    type="number"
                    value={config.document.images.screen.height}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        document: {
                          ...config.document,
                          images: {
                            ...config.document.images,
                            screen: {
                              ...config.document.images.screen,
                              height: parseInt(e.target.value) || 1680,
                            },
                          },
                        },
                      } as FbcConfig)
                    }
                    className="w-full rounded bg-gray-800 px-2 py-1 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.document.images.optimize}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        document: {
                          ...config.document,
                          images: {
                            ...config.document.images,
                            optimize: e.target.checked,
                          },
                        },
                      } as FbcConfig)
                    }
                    className="rounded bg-gray-800"
                  />
                  <span className="text-sm text-gray-300">Optimize images</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.document.images.cover.generate}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        document: {
                          ...config.document,
                          images: {
                            ...config.document.images,
                            cover: {
                              ...config.document.images.cover,
                              generate: e.target.checked,
                            },
                          },
                        },
                      } as FbcConfig)
                    }
                    className="rounded bg-gray-800"
                  />
                  <span className="text-sm text-gray-300">Generate cover</span>
                </label>
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-400">
                  JPEG Quality (40-100)
                </label>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={config.document.images.jpeg_quality_level}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      document: {
                        ...config.document,
                        images: {
                          ...config.document.images,
                          jpeg_quality_level: parseInt(e.target.value),
                        },
                      },
                    } as FbcConfig)
                  }
                  className="w-full"
                />
                <div className="text-right text-xs text-gray-400">
                  {config.document.images.jpeg_quality_level}%
                </div>
              </div>
            </div>
          )}

          {activeTab === 'output' && config && (
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.document.file_name_transliterate}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      document: {
                        ...config.document,
                        file_name_transliterate: e.target.checked,
                      },
                    } as FbcConfig)
                  }
                  className="rounded bg-gray-800"
                />
                <span className="text-sm text-gray-300">Transliterate output filename</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.document.open_from_cover}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      document: {
                        ...config.document,
                        open_from_cover: e.target.checked,
                      },
                    } as FbcConfig)
                  }
                  className="rounded bg-gray-800"
                />
                <span className="text-sm text-gray-300">Open from cover page</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.document.fix_zip}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      document: {
                        ...config.document,
                        fix_zip: e.target.checked,
                      },
                    } as FbcConfig)
                  }
                  className="rounded bg-gray-800"
                />
                <span className="text-sm text-gray-300">Fix ZIP (old format)</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}