import { useEffect } from 'react';
import { useAppStore } from './store';
import { ensureApi, api } from './api';
import { DropZone } from './DropZone';
import { FileQueue } from './FileQueue';
import { FormatSelector } from './FormatSelector';
import { ConversionControls } from './ConversionControls';
import { ConversionResult } from '../../shared/types';

export default function App() {
  const setFbcVersion = useAppStore((s) => s.setFbcVersion);
  const setConfig = useAppStore((s) => s.setConfig);
  const setIsConverting = useAppStore((s) => s.setIsConverting);
  const updateFileStatus = useAppStore((s) => s.updateFileStatus);
  const fbcVersion = useAppStore((s) => s.fbcVersion);

  useEffect(() => {
    const init = async () => {
      try {
        const info = await ensureApi().getSystemInfo();
        if (info.fbcVersion) {
          setFbcVersion(info.fbcVersion);
        }

        const config = await ensureApi().getDefaultConfig();
        setConfig(config);
      } catch (err) {
        console.error('Failed to initialize:', err);
      }
    };

    init();

    if (!api) return;

    const unsubProgress = api.onConvertProgress(({ id, status }) => {
      updateFileStatus(id, status as 'pending' | 'converting' | 'done' | 'error' | 'cancelled');
    });

    const unsubResult = api.onConvertResult((data) => {
      const result = data as ConversionResult;
      updateFileStatus(result.id, result.status);
      setIsConverting(false);
    });

    return () => {
      unsubProgress();
      unsubResult();
    };
  }, [setFbcVersion, setConfig, setIsConverting, updateFileStatus]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-gray-100">
      <header className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Convertique</h1>
          <p className="text-xs text-gray-500">FB2 to EPUB / AZW8 / KFX converter</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">
            fbc: <span className="text-gray-400">{fbcVersion || 'not found'}</span>
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-xl space-y-4">
          <DropZone />
          <FileQueue />
          <FormatSelector />
          <ConversionControls />
        </div>
      </main>
    </div>
  );
}