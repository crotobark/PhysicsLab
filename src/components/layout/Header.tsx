import { useAppStore } from '../../store/useAppStore';

export default function Header() {
  const currentMission = useAppStore((state) => state.currentMission);
  const theoryPanelOpen = useAppStore((state) => state.theoryPanelOpen);
  const setTheoryPanelOpen = useAppStore((state) => state.setTheoryPanelOpen);

  return (
    <header className="h-16 bg-[var(--color-bg-secondary)] border-b border-gray-700 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">PhysicsCodeLab</h1>
        {currentMission && (
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-text-secondary)]">•</span>
            <span className="text-sm">
              Миссия {currentMission.id}: {currentMission.title}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheoryPanelOpen(!theoryPanelOpen)}
          className={`
            px-4 py-2 rounded text-sm font-medium transition-colors
            ${
              theoryPanelOpen
                ? 'bg-[var(--color-accent-blue)] text-white'
                : 'bg-gray-700 text-[var(--color-text-primary)] hover:bg-gray-600'
            }
          `}
        >
          📖 Теория
        </button>
      </div>
    </header>
  );
}
