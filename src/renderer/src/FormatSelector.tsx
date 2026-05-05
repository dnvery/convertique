import { useAppStore } from './store';
import { OUTPUT_FORMATS } from '../../shared/types';

export function FormatSelector() {
  const selectedFormat = useAppStore((s) => s.selectedFormat);
  const setSelectedFormat = useAppStore((s) => s.setSelectedFormat);
  const isConverting = useAppStore((s) => s.isConverting);

  return (
    <div className="mt-4">
      <label className="mb-2 block text-sm font-medium text-gray-300">
        Output Format
      </label>
      <div className="flex flex-wrap gap-2">
        {OUTPUT_FORMATS.map((format) => (
          <button
            key={format.value}
            onClick={() => setSelectedFormat(format.value)}
            disabled={isConverting}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedFormat === format.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } ${isConverting ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {format.label}
          </button>
        ))}
      </div>
    </div>
  );
}