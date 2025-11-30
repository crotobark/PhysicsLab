import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';

export default function MathCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mathCanvasState = useAppStore((state) => state.mathCanvasState);

  // Local view state
  const [view, setView] = useState({
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // Initialize view from state when it changes
  useEffect(() => {
    if (mathCanvasState?.settings) {
      const [xMin, xMax] = mathCanvasState.settings.x_range;
      const [yMin, yMax] = mathCanvasState.settings.y_range;
      setView({ xMin, xMax, yMin, yMax });
    }
  }, [mathCanvasState]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Drawing Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!mathCanvasState) {
      ctx.fillStyle = '#8b949e';
      ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📈', canvas.width / 2, canvas.height / 2 - 40);
      ctx.fillText('Запусти код с mathlab, чтобы увидеть график', canvas.width / 2, canvas.height / 2 + 20);
      return;
    }

    const { settings, functions, points, annotations } = mathCanvasState;
    const { xMin, xMax, yMin, yMax } = view;

    const padding = 40;
    const width = canvas.width;
    const height = canvas.height;

    // Calculate scales
    const xScale = width / (xMax - xMin);
    const yScale = height / (yMax - yMin);

    // Transform functions
    const toCanvasX = (x: number) => (x - xMin) * xScale;
    const toCanvasY = (y: number) => height - (y - yMin) * yScale;

    // Draw Grid
    if (settings.grid) {
      ctx.strokeStyle = '#21262d';
      ctx.lineWidth = 1;
      ctx.beginPath();

      // Vertical lines
      const xStep = Math.pow(10, Math.floor(Math.log10((xMax - xMin) / 10)));
      for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
        const cx = toCanvasX(x);
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, height);
      }

      // Horizontal lines
      const yStep = Math.pow(10, Math.floor(Math.log10((yMax - yMin) / 10)));
      for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
        const cy = toCanvasY(y);
        ctx.moveTo(0, cy);
        ctx.lineTo(width, cy);
      }
      ctx.stroke();
    }

    // Draw Axes
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 2;
    ctx.beginPath();

    // X Axis
    const yZero = toCanvasY(0);
    if (yZero >= 0 && yZero <= height) {
      ctx.moveTo(0, yZero);
      ctx.lineTo(width, yZero);

      // Arrow at positive end
      ctx.moveTo(width - 10, yZero - 5);
      ctx.lineTo(width, yZero);
      ctx.lineTo(width - 10, yZero + 5);
    }

    // Y Axis
    const xZero = toCanvasX(0);
    if (xZero >= 0 && xZero <= width) {
      ctx.moveTo(xZero, height);
      ctx.lineTo(xZero, 0);

      // Arrow at positive end
      ctx.moveTo(xZero - 5, 10);
      ctx.lineTo(xZero, 0);
      ctx.lineTo(xZero + 5, 10);
    }
    ctx.stroke();

    // Draw Ticks and Labels
    ctx.fillStyle = '#8b949e';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // X-axis ticks
    const xLabelStep = Math.pow(10, Math.floor(Math.log10((xMax - xMin) / 8)));
    for (let x = Math.ceil(xMin / xLabelStep) * xLabelStep; x <= xMax; x += xLabelStep) {
      if (Math.abs(x) < xLabelStep / 10) continue; // Skip 0
      const cx = toCanvasX(x);

      // Tick mark
      ctx.beginPath();
      ctx.moveTo(cx, yZero - 4);
      ctx.lineTo(cx, yZero + 4);
      ctx.stroke();

      // Label
      ctx.fillText(x.toFixed(1).replace(/\.0$/, ''), cx, yZero + 8);
    }

    // Y-axis ticks
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const yLabelStep = Math.pow(10, Math.floor(Math.log10((yMax - yMin) / 8)));
    for (let y = Math.ceil(yMin / yLabelStep) * yLabelStep; y <= yMax; y += yLabelStep) {
      if (Math.abs(y) < yLabelStep / 10) continue; // Skip 0
      const cy = toCanvasY(y);

      // Tick mark
      ctx.beginPath();
      ctx.moveTo(xZero - 4, cy);
      ctx.lineTo(xZero + 4, cy);
      ctx.stroke();

      // Label
      ctx.fillText(y.toFixed(1).replace(/\.0$/, ''), xZero - 8, cy);
    }

    // Axis Names
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = '#58a6ff';

    if (yZero >= 0 && yZero <= height) {
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText('x', width - 10, yZero - 10);
    }

    if (xZero >= 0 && xZero <= width) {
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('y', xZero + 10, 10);
    }

    // Draw Functions
    functions.forEach(func => {
      ctx.strokeStyle = func.color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      if (func.style === 'dashed') ctx.setLineDash([5, 5]);
      else if (func.style === 'dotted') ctx.setLineDash([2, 2]);
      else ctx.setLineDash([]);

      let first = true;
      func.points.forEach(([x, y]) => {
        const cx = toCanvasX(x);
        const cy = toCanvasY(y);

        // Check bounds to avoid drawing infinite lines across canvas if not needed, 
        // but for continuous functions we usually want them to extend.
        // Adding a simple bounds check to prevent issues with very large coordinates
        if (cx >= -width && cx <= 2 * width && cy >= -height && cy <= 2 * height) {
          if (first) {
            ctx.moveTo(cx, cy);
            first = false;
          } else {
            ctx.lineTo(cx, cy);
          }
        } else {
          first = true; // Break line if out of reasonable bounds
        }
      });
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw Points
    points.forEach(point => {
      const cx = toCanvasX(point.x);
      const cy = toCanvasY(point.y);

      ctx.fillStyle = point.color;
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();

      if (point.label) {
        ctx.fillStyle = '#c9d1d9';
        ctx.font = '12px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(point.label, cx + 8, cy - 8);
      }
    });

    // Draw Annotations
    annotations.forEach(ann => {
      const cx = toCanvasX(ann.x);
      const cy = toCanvasY(ann.y);
      ctx.fillStyle = ann.color;
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ann.text, cx, cy);
    });

    // Draw Legend
    if (functions.length > 0) {
      let legendY = 20;
      const legendX = width - padding - 150;

      // Legend background
      ctx.fillStyle = 'rgba(13, 17, 23, 0.8)';
      ctx.fillRect(legendX - 10, 10, 160, functions.length * 25 + 10);
      ctx.strokeStyle = '#30363d';
      ctx.lineWidth = 1;
      ctx.strokeRect(legendX - 10, 10, 160, functions.length * 25 + 10);

      functions.forEach((func) => {
        // Line sample
        ctx.strokeStyle = func.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(legendX, legendY + 10);
        ctx.lineTo(legendX + 30, legendY + 10);
        ctx.stroke();

        // Name
        ctx.fillStyle = '#c9d1d9';
        ctx.font = '12px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(func.name, legendX + 40, legendY + 10);

        legendY += 25;
      });
    }

  }, [mathCanvasState, view]);

  // Interaction Handlers
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const scale = e.deltaY > 0 ? 1.1 : 0.9;

    const rangeX = view.xMax - view.xMin;
    const rangeY = view.yMax - view.yMin;

    const newRangeX = rangeX * scale;
    const newRangeY = rangeY * scale;

    const dx = (newRangeX - rangeX) / 2;
    const dy = (newRangeY - rangeY) / 2;

    setView(v => ({
      xMin: v.xMin - dx,
      xMax: v.xMax + dx,
      yMin: v.yMin - dy,
      yMax: v.yMax + dy,
    }));
  }, [view]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rangeX = view.xMax - view.xMin;
    const rangeY = view.yMax - view.yMin;

    const scaleX = rangeX / canvas.width;
    const scaleY = rangeY / canvas.height;

    setView(v => ({
      xMin: v.xMin - dx * scaleX,
      xMax: v.xMax - dx * scaleX,
      yMin: v.yMin + dy * scaleY,
      yMax: v.yMax + dy * scaleY,
    }));

    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    if (mathCanvasState?.settings) {
      const [xMin, xMax] = mathCanvasState.settings.x_range;
      const [yMin, yMax] = mathCanvasState.settings.y_range;
      setView({ xMin, xMax, yMin, yMax });
    }
  };

  const zoomIn = () => {
    const rangeX = view.xMax - view.xMin;
    const rangeY = view.yMax - view.yMin;
    setView(v => ({
      xMin: v.xMin + rangeX * 0.1,
      xMax: v.xMax - rangeX * 0.1,
      yMin: v.yMin + rangeY * 0.1,
      yMax: v.yMax - rangeY * 0.1,
    }));
  };

  const zoomOut = () => {
    const rangeX = view.xMax - view.xMin;
    const rangeY = view.yMax - view.yMin;
    setView(v => ({
      xMin: v.xMin - rangeX * 0.1,
      xMax: v.xMax + rangeX * 0.1,
      yMin: v.yMin - rangeY * 0.1,
      yMax: v.yMax + rangeY * 0.1,
    }));
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative bg-[#0d1117] overflow-hidden group"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-move"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={zoomIn}
          className="p-2 bg-[#21262d] text-[#c9d1d9] rounded hover:bg-[#30363d] border border-[#30363d]"
          title="Zoom In"
        >
          ➕
        </button>
        <button
          onClick={zoomOut}
          className="p-2 bg-[#21262d] text-[#c9d1d9] rounded hover:bg-[#30363d] border border-[#30363d]"
          title="Zoom Out"
        >
          ➖
        </button>
        <button
          onClick={resetView}
          className="p-2 bg-[#21262d] text-[#c9d1d9] rounded hover:bg-[#30363d] border border-[#30363d]"
          title="Reset View"
        >
          🔄
        </button>
      </div>
    </div>
  );
}
