import { useAppStore } from '../../store/useAppStore';

interface SimulationControlsProps {
  onRun: () => void;
  onPause: () => void;
  onReset: () => void;
}

export default function SimulationControls({
  onRun,
  onPause,
  onReset,
}: SimulationControlsProps) {
  const isRunning = useAppStore((state) => state.isRunning);
  const isPaused = useAppStore((state) => state.isPaused);

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={isRunning && !isPaused ? onPause : onRun}
        className="
          px-4 py-2 rounded font-medium text-sm
          bg-[var(--color-accent-blue)] hover:bg-[#4a8fd9]
          text-white transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {isRunning && !isPaused ? '⏸ Пауза' : '▶ Запустить'}
      </button>

      <button
        onClick={onReset}
        className="
          px-4 py-2 rounded font-medium text-sm
          bg-gray-700 hover:bg-gray-600
          text-[var(--color-text-primary)] transition-colors
        "
      >
        🔄 Сброс
      </button>

      <div className="h-6 w-px bg-gray-600 mx-2" />

      <div className="text-sm text-[var(--color-text-secondary)]">
        {isRunning ? (
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--color-accent-green)] rounded-full animate-pulse" />
            Симуляция запущена
          </span>
        ) : (
          <span>Готов к запуску</span>
        )}
      </div>
    </div>
  );
}
