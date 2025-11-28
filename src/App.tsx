import { useEffect } from 'react';
import Header from './components/layout/Header';
import MainLayout from './components/layout/MainLayout';
import SimulationCanvas from './components/simulation/SimulationCanvas';
import SimulationControls from './components/simulation/SimulationControls';
import CodeEditor from './components/editor/CodeEditor';
import TheoryPanel from './components/theory/TheoryPanel';
import { useAppStore } from './store/useAppStore';

// Import mission 1.1 (we'll create this next)
import mission1_1 from './content/missions/mission1_1';

function App() {
  const setCurrentMission = useAppStore((state) => state.setCurrentMission);
  const resetMission = useAppStore((state) => state.resetMission);

  // Load mission 1.1 on mount
  useEffect(() => {
    setCurrentMission(mission1_1);
  }, [setCurrentMission]);

  const handleRun = () => {
    // TODO: Execute Python code
    console.log('Running code...');
  };

  const handlePause = () => {
    // TODO: Pause simulation
    console.log('Pausing simulation...');
  };

  const handleReset = () => {
    resetMission();
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-hidden">
        <MainLayout
          theory={<TheoryPanel />}
          visualization={<SimulationCanvas />}
          editor={<CodeEditor />}
          controls={
            <SimulationControls
              onRun={handleRun}
              onPause={handlePause}
              onReset={handleReset}
            />
          }
        />
      </div>
    </div>
  );
}

export default App;
