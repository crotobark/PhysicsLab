import { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';

export default function SimulationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pythonWorldState = useAppStore((state) => state.pythonWorldState);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }

    // Clear canvas
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // If no world state, show placeholder
    if (!pythonWorldState) {
      ctx.fillStyle = '#8b949e';
      ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🚀', canvas.width / 2, canvas.height / 2 - 40);
      ctx.fillText('Запусти код, чтобы увидеть визуализацию', canvas.width / 2, canvas.height / 2 + 20);
      return;
    }

    // Calculate scale to fit world into canvas
    const scaleX = canvas.width / pythonWorldState.width;
    const scaleY = canvas.height / pythonWorldState.height;
    const scale = Math.min(scaleX, scaleY) * 0.9; // 90% to add padding

    // Center offset
    const offsetX = (canvas.width - pythonWorldState.width * scale) / 2;
    const offsetY = (canvas.height - pythonWorldState.height * scale) / 2;

    // Draw boundaries if enabled
    if (pythonWorldState.boundaries) {
      ctx.strokeStyle = '#30363d';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        offsetX,
        offsetY,
        pythonWorldState.width * scale,
        pythonWorldState.height * scale
      );
    }

    // Draw all bodies
    pythonWorldState.bodies.forEach((body) => {
      const x = offsetX + body.x * scale;
      const y = offsetY + body.y * scale;

      if (body.type === 'Ball') {
        const radius = (body.radius || 10) * scale;

        // Draw ball
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);

        // Fill with color
        const color = body.color || 'blue';
        ctx.fillStyle = color;
        ctx.fill();

        // Draw outline
        ctx.strokeStyle = body.fixed ? '#ffd700' : '#ffffff';
        ctx.lineWidth = body.fixed ? 3 : 1;
        ctx.stroke();

        // Draw velocity vector if moving
        if (body.vx !== undefined && body.vy !== undefined) {
          const speed = Math.sqrt(body.vx ** 2 + body.vy ** 2);
          if (speed > 0.1) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + body.vx * scale * 2, y + body.vy * scale * 2);
            ctx.strokeStyle = '#58a6ff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Arrow head
            const angle = Math.atan2(body.vy, body.vx);
            const arrowSize = 5;
            ctx.beginPath();
            ctx.moveTo(x + body.vx * scale * 2, y + body.vy * scale * 2);
            ctx.lineTo(
              x + body.vx * scale * 2 - arrowSize * Math.cos(angle - Math.PI / 6),
              y + body.vy * scale * 2 - arrowSize * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
              x + body.vx * scale * 2 - arrowSize * Math.cos(angle + Math.PI / 6),
              y + body.vy * scale * 2 - arrowSize * Math.sin(angle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fillStyle = '#58a6ff';
            ctx.fill();
          }
        }
      } else if (body.type === 'Platform') {
        const width = (body.width || 100) * scale;
        const height = (body.height || 10) * scale;

        // Draw platform
        ctx.fillStyle = '#6e7681';
        ctx.fillRect(x, y, width, height);

        // Draw outline
        ctx.strokeStyle = '#8b949e';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
      }
    });

    // Draw info text
    ctx.fillStyle = '#8b949e';
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Тел: ${pythonWorldState.bodies.length}`, 10, 10);
    ctx.fillText(`Гравитация: ${pythonWorldState.gravity} м/с²`, 10, 30);
    ctx.fillText(`Размер: ${pythonWorldState.width}×${pythonWorldState.height}`, 10, 50);

  }, [pythonWorldState]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;

        // Trigger re-render by forcing effect dependency
        const event = new CustomEvent('resize');
        canvas.dispatchEvent(event);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-full relative bg-[#0d1117]">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
}
