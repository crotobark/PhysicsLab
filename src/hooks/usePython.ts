import { useState, useCallback } from 'react';
import { runPythonCode, loadPyodide } from '../lib/pyodide';
import { useAppStore } from '../store/useAppStore';
import type { PythonWorldState } from '../types';

export function usePython() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPyodideReady, setIsPyodideReady] = useState(false);

  const setIsRunning = useAppStore((state) => state.setIsRunning);
  const addConsoleOutput = useAppStore((state) => state.addConsoleOutput);
  const clearConsoleOutput = useAppStore((state) => state.clearConsoleOutput);
  const setPythonWorldState = useAppStore((state) => state.setPythonWorldState);

  // Initialize Pyodide
  const initialize = useCallback(async () => {
    if (isPyodideReady) return;

    setIsLoading(true);
    addConsoleOutput({
      type: 'log',
      content: 'Загрузка Python runtime...',
      timestamp: Date.now(),
    });

    try {
      await loadPyodide();
      setIsPyodideReady(true);
      addConsoleOutput({
        type: 'log',
        content: '✓ Python runtime готов',
        timestamp: Date.now(),
      });
    } catch (error: any) {
      addConsoleOutput({
        type: 'error',
        content: `Ошибка загрузки Python: ${error.message}`,
        timestamp: Date.now(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [isPyodideReady, addConsoleOutput]);

  // Extract world state from Python output
  const extractWorldState = (output: string): PythonWorldState | null => {
    const startMarker = '__WORLD_STATE__';
    const endMarker = '__END_WORLD_STATE__';

    const startIndex = output.indexOf(startMarker);
    const endIndex = output.indexOf(endMarker);

    if (startIndex === -1 || endIndex === -1) {
      return null;
    }

    const jsonStr = output.substring(startIndex + startMarker.length, endIndex).trim();

    try {
      return JSON.parse(jsonStr) as PythonWorldState;
    } catch (e) {
      console.error('Failed to parse world state JSON:', e);
      return null;
    }
  };

  // Run Python code
  const runCode = useCallback(
    async (code: string) => {
      setIsRunning(true);
      clearConsoleOutput();
      setPythonWorldState(null);

      addConsoleOutput({
        type: 'log',
        content: '▶ Запуск кода...',
        timestamp: Date.now(),
      });

      try {
        // Initialize if not ready
        if (!isPyodideReady) {
          await initialize();
        }

        // Run the code
        const result = await runPythonCode(code);

        if (result.success) {
          // Extract world state from output
          const worldState = extractWorldState(result.output);
          if (worldState) {
            setPythonWorldState(worldState);
          }

          // Clean output by removing world state markers
          let cleanOutput = result.output;
          const startMarker = '__WORLD_STATE__';
          const endMarker = '__END_WORLD_STATE__';
          const startIndex = cleanOutput.indexOf(startMarker);
          const endIndex = cleanOutput.indexOf(endMarker);

          if (startIndex !== -1 && endIndex !== -1) {
            cleanOutput = cleanOutput.substring(0, startIndex) +
                         cleanOutput.substring(endIndex + endMarker.length);
          }

          if (cleanOutput.trim()) {
            addConsoleOutput({
              type: 'log',
              content: cleanOutput.trim(),
              timestamp: Date.now(),
            });
          }

          addConsoleOutput({
            type: 'log',
            content: '✓ Выполнено успешно',
            timestamp: Date.now(),
          });
        } else {
          addConsoleOutput({
            type: 'error',
            content: result.error || 'Неизвестная ошибка',
            timestamp: Date.now(),
          });
        }
      } catch (error: any) {
        addConsoleOutput({
          type: 'error',
          content: error.message || String(error),
          timestamp: Date.now(),
        });
      } finally {
        setIsRunning(false);
      }
    },
    [isPyodideReady, initialize, setIsRunning, clearConsoleOutput, addConsoleOutput, setPythonWorldState]
  );

  return {
    runCode,
    initialize,
    isLoading,
    isPyodideReady,
  };
}
