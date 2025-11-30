import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import HomePage from './pages/HomePage';
import MissionsPage from './pages/MissionsPage';
import LabPage from './pages/LabPage';

function App() {
  const setParameters = useAppStore((state) => state.setParameters);

  // Initialize parameters when mission changes
  useEffect(() => {
    const currentMission = useAppStore.getState().currentMission;
    if (currentMission) {
      import('./config/interactiveConfigs').then(({ getInteractiveConfig }) => {
        const config = getInteractiveConfig(currentMission.id);
        if (config) {
          const defaults: Record<string, number> = {};
          config.parameters.forEach((p) => {
            defaults[p.name] = p.defaultValue;
          });
          setParameters(defaults);
        }
      });
    }
  }, [setParameters]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/missions" element={<MissionsPage />} />
        <Route path="/lab" element={<LabPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
