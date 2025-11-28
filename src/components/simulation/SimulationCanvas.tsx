import { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';
import { useAppStore } from '../../store/useAppStore';

export default function SimulationCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const worldState = useAppStore((state) => state.worldState);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize PixiJS Application
    const app = new Application();
    appRef.current = app;

    (async () => {
      await app.init({
        width: canvasRef.current?.clientWidth || 800,
        height: canvasRef.current?.clientHeight || 600,
        backgroundColor: 0x0d1117,
        antialias: true,
      });

      if (canvasRef.current) {
        canvasRef.current.appendChild(app.canvas as HTMLCanvasElement);
      }
    })();

    // Cleanup
    return () => {
      app.destroy(true);
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (appRef.current && canvasRef.current) {
        appRef.current.renderer.resize(
          canvasRef.current.clientWidth,
          canvasRef.current.clientHeight
        );
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Render world state (will implement later)
  useEffect(() => {
    if (!appRef.current || !worldState) return;

    // TODO: Render physics bodies based on worldState
    // This will be implemented when we build the renderer

  }, [worldState]);

  return (
    <div
      ref={canvasRef}
      className="w-full h-full relative"
      style={{ touchAction: 'none' }}
    >
      {!worldState && (
        <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-secondary)]">
          <div className="text-center">
            <div className="text-6xl mb-4">🚀</div>
            <p className="text-lg">Запусти код, чтобы начать симуляцию</p>
          </div>
        </div>
      )}
    </div>
  );
}
