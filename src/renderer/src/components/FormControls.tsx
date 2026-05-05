interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <label className={`flex items-center gap-2 ${disabled ? 'opacity-50' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-sm text-gray-300">{label}</span>
    </label>
  );
}

interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  label?: string;
  disabled?: boolean;
}

export function Select<T extends string>({ value, onChange, options, label, disabled }: SelectProps<T>) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-gray-400">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        disabled={disabled}
        className="rounded bg-gray-800 px-2 py-1 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface SliderInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label?: string;
  showValue?: boolean;
}

export function SliderInput({ value, onChange, min, max, label, showValue }: SliderInputProps) {
  return (
    <div>
      {label && (
        <label className="mb-1 block text-xs text-gray-400">{label}</label>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full"
      />
      {showValue && (
        <div className="text-right text-xs text-gray-400">{value}</div>
      )}
    </div>
  );
}

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export function NumberInput({ value, onChange, min = 0, max, label }: NumberInputProps) {
  return (
    <div>
      {label && (
        <label className="mb-1 block text-xs text-gray-400">{label}</label>
      )}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || min)}
        min={min}
        max={max}
        className="w-full rounded bg-gray-800 px-2 py-1 text-sm text-white"
      />
    </div>
  );
}

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export function TextInput({ value, onChange, label, placeholder }: TextInputProps) {
  return (
    <div>
      {label && (
        <label className="mb-1 block text-xs text-gray-400">{label}</label>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded bg-gray-800 px-2 py-1 text-sm text-white placeholder-gray-500"
      />
    </div>
  );
}

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
}

export function TextArea({ value, onChange, label, placeholder, rows = 6 }: TextAreaProps) {
  return (
    <div>
      {label && (
        <label className="mb-1 block text-xs text-gray-400">{label}</label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded bg-gray-800 px-2 py-1 text-sm text-white placeholder-gray-500 font-mono"
      />
    </div>
  );
}