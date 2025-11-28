import { useAppStore } from '../../store/useAppStore';

interface MainLayoutProps {
  theory: React.ReactNode;
  visualization: React.ReactNode;
  editor: React.ReactNode;
  controls: React.ReactNode;
}

export default function MainLayout({
  theory,
  visualization,
  editor,
  controls,
}: MainLayoutProps) {
  const theoryPanelOpen = useAppStore((state) => state.theoryPanelOpen);

  return (
    <div className="flex h-full w-full bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      {/* Theory Panel - Collapsible */}
      <div
        className={`
          transition-all duration-300 ease-out
          ${theoryPanelOpen ? 'w-80' : 'w-0'}
          overflow-hidden bg-[var(--color-bg-secondary)]
          border-r border-gray-700
        `}
      >
        {theoryPanelOpen && (
          <div className="h-full overflow-y-auto p-4">
            {theory}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Visualization Area */}
        <div className="flex-1 relative border-b border-gray-700">
          {visualization}
        </div>

        {/* Code Editor + Controls */}
        <div className="h-80 flex flex-col border-t border-gray-700">
          {/* Controls */}
          <div className="h-14 border-b border-gray-700 px-4 flex items-center gap-3 bg-[var(--color-bg-secondary)]">
            {controls}
          </div>

          {/* Editor */}
          <div className="flex-1">
            {editor}
          </div>
        </div>
      </div>
    </div>
  );
}
