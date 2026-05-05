import { useCallback } from 'react';
import { useAppStore } from './store';
import { ensureApi } from './api';
import { getDefaultConfig } from '../../shared/types';

export function ConversionControls() {
  const files = useAppStore((s) => s.files);
  const selectedFormat = useAppStore((s) => s.selectedFormat);
  const outputDirectory = useAppStore((s) => s.outputDirectory);
  const isConverting = useAppStore((s) => s.isConverting);
  const setIsConverting = useAppStore((s) => s.setIsConverting);
  const updateFileStatus = useAppStore((s) => s.updateFileStatus);
  const config = useAppStore((s) => s.config);

  const handleConvert = useCallback(async () => {
    if (files.length === 0 || isConverting || !outputDirectory) return;

    const pendingFiles = files.filter((f) => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    const tasks = pendingFiles.map((f) => ({
      id: f.id,
      sourcePath: f.path,
      destinationPath: outputDirectory,
      format: selectedFormat,
    }));

    setIsConverting(true);
    tasks.forEach((t) => updateFileStatus(t.id, 'converting'));

    try {
      const storeConfig = useAppStore.getState().config;
      const cfg = storeConfig ?? getDefaultConfig();
      console.log('Image screen width in config:', cfg?.document?.images?.screen?.width);
      await ensureApi().convertStart(tasks, cfg);
    } catch (err) {
      console.error('Conversion error:', err);
      tasks.forEach((t) => updateFileStatus(t.id, 'error'));
    } finally {
      setIsConverting(false);
    }
  }, [files, selectedFormat, outputDirectory, isConverting, setIsConverting, updateFileStatus]);

  const handleSelectOutput = useCallback(async () => {
    try {
      const result = await ensureApi().selectDirectory();
      if (!result.canceled && result.filePaths.length > 0) {
        useAppStore.getState().setOutputDirectory(result.filePaths[0]);
      }
    } catch {
      // ignore errors
    }
  }, []);

  const canConvert = files.length > 0 && outputDirectory && !isConverting && files.some((f) => f.status === 'pending');

  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-400">Output folder:</label>
        <button
          onClick={handleSelectOutput}
          disabled={isConverting}
          className="flex-1 rounded-lg bg-gray-800 px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 disabled:opacity-50"
        >
          {outputDirectory || 'Select output directory...'}
        </button>
      </div>

      <button
        onClick={handleConvert}
        disabled={!canConvert}
        className={`w-full rounded-lg py-3 text-sm font-medium transition-colors ${
          canConvert
            ? 'bg-blue-600 text-white hover:bg-blue-500'
            : 'cursor-not-allowed bg-gray-700 text-gray-500'
        }`}
      >
        {isConverting ? 'Converting...' : 'Start Conversion'}
      </button>
    </div>
  );
}