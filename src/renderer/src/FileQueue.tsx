import { useAppStore } from './store';

export function FileQueue() {
  const files = useAppStore((s) => s.files);
  const removeFile = useAppStore((s) => s.removeFile);
  const isConverting = useAppStore((s) => s.isConverting);

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 w-full">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-300">Files ({files.length})</h3>
        {!isConverting && files.length > 0 && (
          <button
            onClick={() => files.forEach((f) => removeFile(f.id))}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Clear all
          </button>
        )}
      </div>
      <ul className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-gray-700 bg-gray-900/50 p-2">
        {files.map((file) => (
          <li
            key={file.id}
            className="flex items-center justify-between rounded bg-gray-800 px-3 py-2"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  file.status === 'done'
                    ? 'bg-green-500'
                    : file.status === 'error'
                      ? 'bg-red-500'
                      : file.status === 'converting'
                        ? 'bg-blue-500 animate-pulse'
                        : 'bg-gray-500'
                }`}
              />
              <span className="truncate text-sm text-gray-300" title={file.name}>
                {file.name}
              </span>
            </div>
            {!isConverting && file.status === 'pending' && (
              <button
                onClick={() => removeFile(file.id)}
                className="ml-2 text-gray-500 hover:text-red-400"
              >
                &times;
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}