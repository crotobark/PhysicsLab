import Editor from '@monaco-editor/react';
import { useAppStore } from '../../store/useAppStore';

export default function CodeEditor() {
  const code = useAppStore((state) => state.code);
  const setCode = useAppStore((state) => state.setCode);
  const isRunning = useAppStore((state) => state.isRunning);

  return (
    <Editor
      height="100%"
      defaultLanguage="python"
      value={code}
      onChange={(value) => setCode(value || '')}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
        lineNumbers: 'on',
        roundedSelection: true,
        scrollBeyondLastLine: false,
        readOnly: isRunning,
        automaticLayout: true,
        tabSize: 4,
        wordWrap: 'on',
        suggestOnTriggerCharacters: true,
        quickSuggestions: {
          other: true,
          comments: false,
          strings: false,
        },
      }}
      loading={
        <div className="flex items-center justify-center h-full bg-[#1e1e1e]">
          <div className="text-[var(--color-text-secondary)]">
            Загрузка редактора...
          </div>
        </div>
      }
    />
  );
}
