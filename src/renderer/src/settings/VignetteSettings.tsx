import { useAppStore } from '../store';
import { TextInput } from '../components/FormControls';

export function VignetteSettings() {
  const config = useAppStore((s) => s.config);
  const setConfig = useAppStore((s) => s.setConfig);

  if (!config) return null;

  const book = config.document.vignettes?.book || {};
  const chapter = config.document.vignettes?.chapter || {};
  const section = config.document.vignettes?.section || {};

  const updateBook = (field: string, value: string) => {
    setConfig({
      ...config,
      document: {
        ...config.document,
        vignettes: {
          ...config.document.vignettes,
          book: { ...book, [field]: value },
        },
      },
    });
  };

  const updateChapter = (field: string, value: string) => {
    setConfig({
      ...config,
      document: {
        ...config.document,
        vignettes: {
          ...config.document.vignettes,
          chapter: { ...chapter, [field]: value },
        },
      },
    });
  };

  const updateSection = (field: string, value: string) => {
    setConfig({
      ...config,
      document: {
        ...config.document,
        vignettes: {
          ...config.document.vignettes,
          section: { ...section, [field]: value },
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 text-sm font-medium text-gray-300">Book</h4>
        <div className="space-y-2">
          <TextInput
            label="Title top"
            value={book.title_top || ''}
            onChange={(v) => updateBook('title_top', v)}
          />
          <TextInput
            label="Title bottom"
            value={book.title_bottom || ''}
            onChange={(v) => updateBook('title_bottom', v)}
          />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-medium text-gray-300">Chapter</h4>
        <div className="space-y-2">
          <TextInput
            label="Title top"
            value={chapter.title_top || ''}
            onChange={(v) => updateChapter('title_top', v)}
          />
          <TextInput
            label="Title bottom"
            value={chapter.title_bottom || ''}
            onChange={(v) => updateChapter('title_bottom', v)}
          />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-medium text-gray-300">Section</h4>
        <TextInput
          label="Title top"
          value={section.title_top || ''}
          onChange={(v) => updateSection('title_top', v)}
        />
      </div>
    </div>
  );
}