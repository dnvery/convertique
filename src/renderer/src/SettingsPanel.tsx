import { useState } from 'react';
import { useAppStore } from './store';
import { DEVICE_PRESETS, DevicePresetKey, OUTPUT_FORMATS, FbcConfig } from '../../shared/types';
import { GeneralSettings } from './settings/GeneralSettings';
import { ImageSettings } from './settings/ImageSettings';
import { FootnotesSettings } from './settings/FootnotesSettings';
import { TOCSettings } from './settings/TOCSettings';
import { AnnotationSettings } from './settings/AnnotationSettings';
import { PageMapSettings } from './settings/PageMapSettings';
import { VignetteSettings } from './settings/VignetteSettings';
import { DropcapsSettings } from './settings/DropcapsSettings';
import { TextTransformSettings } from './settings/TextTransformSettings';
import { MetadataSettings } from './settings/MetadataSettings';
import { OutputSettings } from './settings/OutputSettings';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const TABS = [
  { id: 'device', label: 'Device' },
  { id: 'general', label: 'General' },
  { id: 'images', label: 'Images' },
  { id: 'footnotes', label: 'Footnotes' },
  { id: 'toc', label: 'TOC' },
  { id: 'annotation', label: 'Annotation' },
  { id: 'pagemap', label: 'Page Map' },
  { id: 'vignettes', label: 'Vignettes' },
  { id: 'dropcaps', label: 'Drop Caps' },
  { id: 'transforms', label: 'Transforms' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'output', label: 'Output' },
] as const;

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const config = useAppStore((s) => s.config);
  const setConfig = useAppStore((s) => s.setConfig);
  const selectedFormat = useAppStore((s) => s.selectedFormat);
  const setSelectedFormat = useAppStore((s) => s.setSelectedFormat);

  const [activePreset, setActivePreset] = useState<DevicePresetKey | null>(null);
  const [activeTab, setActiveTab] = useState<string>('device');

  if (!isOpen) return null;

  const handlePresetSelect = (presetKey: DevicePresetKey) => {
    setActivePreset(presetKey);
    const preset = DEVICE_PRESETS[presetKey];
    setSelectedFormat(preset.defaultFormat);
    
    if (!config) return;
    
    // Update config based on preset
    const newConfig = { ...config };
    const pconfig = preset.config;
    
    // Apply preset settings to config.document
    newConfig.document = { ...newConfig.document };
    
    // toc_type if present
    if ('toc_type' in pconfig) {
      newConfig.document.toc_type = pconfig.toc_type;
    }
    
    // images.screen and images.cover
    if ('images' in pconfig) {
      newConfig.document.images = {
        ...newConfig.document.images,
        screen: pconfig.images.screen,
      };
      
      if ('cover' in pconfig.images) {
        newConfig.document.images.cover = {
          ...newConfig.document.images.cover,
          ...pconfig.images.cover
        };
      }
    }
    
    setConfig(newConfig);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'device':
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Device Preset</label>
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
              <label className="mb-2 block text-sm font-medium text-gray-300">Output Format</label>
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
        );
      case 'general':
        return <GeneralSettings />;
      case 'images':
        return <ImageSettings />;
      case 'footnotes':
        return <FootnotesSettings />;
      case 'toc':
        return <TOCSettings />;
      case 'annotation':
        return <AnnotationSettings />;
      case 'pagemap':
        return <PageMapSettings />;
      case 'vignettes':
        return <VignetteSettings />;
      case 'dropcaps':
        return <DropcapsSettings />;
      case 'transforms':
        return <TextTransformSettings />;
      case 'metadata':
        return <MetadataSettings />;
      case 'output':
        return <OutputSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-hidden">
      <div className="h-[85vh] w-[95vw] max-w-4xl rounded-lg bg-gray-900 p-4 flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-700 pb-3 mb-3">
          <h2 className="text-lg font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-wrap gap-1 border-b border-gray-700 pb-2 mb-3">
          {TABS.map((tab) => (
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

        <div className="flex-1 overflow-y-auto">{renderTabContent()}</div>
      </div>
    </div>
  );
}