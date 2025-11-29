import { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';

export default function MathCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mathCanvasState = useAppStore((state) => state.mathCanvasState);

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

    // Clear canvas with dark background
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // If no math canvas state, show placeholder
    if (!mathCanvasState) {
      ctx.fillStyle = '#8b949e';
      ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📈', canvas.width / 2, canvas.height / 2 - 40);
      ctx.fillText('Запусти код с mathlab, чтобы увидеть график', canvas.width / 2, canvas.height / 2 + 20);
      return;
    }

    const { settings, functions, points, lines, annotations } = mathCanvasState;
    const [xMin, xMax] = settings.x_range;
    const [yMin, yMax] = settings.y_range;

    // Calculate scaling and offset
    const padding = 60; // Padding for axes labels
    const plotWidth = canvas.width - 2 * padding;
    const plotHeight = canvas.height - 2 * padding;

    const xScale = plotWidth / (xMax - xMin);
    const yScale = plotHeight / (yMax - yMin);

    // Transform world coordinates to canvas coordinates
    const toCanvasX = (x: number) => padding + (x - xMin) * xScale;
    const toCanvasY = (y: number) => canvas.height - padding - (y - yMin) * yScale;

    // Draw grid if enabled
    if (settings.grid) {
      ctx.strokeStyle = '#21262d';
      ctx.lineWidth = 1;

      // Vertical grid lines
      const xStep = Math.pow(10, Math.floor(Math.log10((xMax - xMin) / 10)));
      for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
        const canvasX = toCanvasX(x);
        ctx.beginPath();
        ctx.moveTo(canvasX, padding);
        ctx.lineTo(canvasX, canvas.height - padding);
        ctx.stroke();
      }

      // Horizontal grid lines
      const yStep = Math.pow(10, Math.floor(Math.log10((yMax - yMin) / 10)));
      for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
        const canvasY = toCanvasY(y);
        ctx.beginPath();
        ctx.moveTo(padding, canvasY);
        ctx.lineTo(canvas.width - padding, canvasY);
        ctx.stroke();
      }
    }

    // Draw axes
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 2;

    // X-axis
    const yAxisPos = toCanvasY(0);
    if (yAxisPos >= padding && yAxisPos <= canvas.height - padding) {
      ctx.beginPath();
      ctx.moveTo(padding, yAxisPos);
      ctx.lineTo(canvas.width - padding, yAxisPos);
      ctx.stroke();

      // X-axis arrow
      ctx.beginPath();
      ctx.moveTo(canvas.width - padding, yAxisPos);
      ctx.lineTo(canvas.width - padding - 10, yAxisPos - 5);
      ctx.lineTo(canvas.width - padding - 10, yAxisPos + 5);
      ctx.closePath();
      ctx.fillStyle = '#58a6ff';
      ctx.fill();

      // X label
      ctx.fillStyle = '#8b949e';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('x', canvas.width - padding + 20, yAxisPos);
    }

    // Y-axis
    const xAxisPos = toCanvasX(0);
    if (xAxisPos >= padding && xAxisPos <= canvas.width - padding) {
      ctx.beginPath();
      ctx.moveTo(xAxisPos, padding);
      ctx.lineTo(xAxisPos, canvas.height - padding);
      ctx.stroke();

      // Y-axis arrow
      ctx.beginPath();
      ctx.moveTo(xAxisPos, padding);
      ctx.lineTo(xAxisPos - 5, padding + 10);
      ctx.lineTo(xAxisPos + 5, padding + 10);
      ctx.closePath();
      ctx.fillStyle = '#58a6ff';
      ctx.fill();

      // Y label
      ctx.fillStyle = '#8b949e';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('y', xAxisPos, padding - 20);
    }

    // Draw axis labels (numbers)
    ctx.fillStyle = '#6e7681';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // X-axis labels
    const xLabelStep = Math.pow(10, Math.floor(Math.log10((xMax - xMin) / 8)));
    for (let x = Math.ceil(xMin / xLabelStep) * xLabelStep; x <= xMax; x += xLabelStep) {
      if (Math.abs(x) < xLabelStep / 10) continue; // Skip 0
      const canvasX = toCanvasX(x);
      ctx.fillText(x.toFixed(1), canvasX, yAxisPos + 5);
    }

    // Y-axis labels
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const yLabelStep = Math.pow(10, Math.floor(Math.log10((yMax - yMin) / 8)));
    for (let y = Math.ceil(yMin / yLabelStep) * yLabelStep; y <= yMax; y += yLabelStep) {
      if (Math.abs(y) < yLabelStep / 10) continue; // Skip 0
      const canvasY = toCanvasY(y);
      ctx.fillText(y.toFixed(1), xAxisPos - 10, canvasY);
    }

    // Draw lines (from mathlab canvas.draw_line())
    lines.forEach((line) => {
      const from = Array.isArray(line.from) ? line.from : [line.from.x, line.from.y];
      const to = Array.isArray(line.to) ? line.to : [line.to.x, line.to.y];

      ctx.strokeStyle = line.color;
      ctx.lineWidth = 2;

      if (line.style === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.beginPath();
      ctx.moveTo(toCanvasX(from[0]), toCanvasY(from[1]));
      ctx.lineTo(toCanvasX(to[0]), toCanvasY(to[1]));
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw functions
    functions.forEach((func) => {
      ctx.strokeStyle = func.color;
      ctx.lineWidth = 2.5;

      if (func.style === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else if (func.style === 'dotted') {
        ctx.setLineDash([2, 3]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.beginPath();
      let started = false;

      func.points.forEach(([x, y]) => {
        const canvasX = toCanvasX(x);
        const canvasY = toCanvasY(y);

        // Check if point is within bounds
        if (canvasX >= padding && canvasX <= canvas.width - padding &&
            canvasY >= padding && canvasY <= canvas.height - padding) {
          if (!started) {
            ctx.moveTo(canvasX, canvasY);
            started = true;
          } else {
            ctx.lineTo(canvasX, canvasY);
          }
        } else {
          started = false; // Break the line if out of bounds
        }
      });

      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw points
    points.forEach((point) => {
      const canvasX = toCanvasX(point.x);
      const canvasY = toCanvasY(point.y);

      // Draw point circle
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 5, 0, Math.PI * 2);
      ctx.fillStyle = point.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label if exists
      if (point.label) {
        ctx.fillStyle = '#c9d1d9';
        ctx.font = '12px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(point.label, canvasX + 8, canvasY - 8);
      }
    });

    // Draw annotations
    annotations.forEach((ann) => {
      const canvasX = toCanvasX(ann.x);
      const canvasY = toCanvasY(ann.y);

      ctx.fillStyle = ann.color;
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ann.text, canvasX, canvasY);
    });

    // Draw legend
    if (functions.length > 0) {
      let legendY = 20;
      const legendX = canvas.width - padding - 200;

      functions.forEach((func) => {
        // Line sample
        ctx.strokeStyle = func.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(legendX, legendY);
        ctx.lineTo(legendX + 30, legendY);
        ctx.stroke();

        // Name
        ctx.fillStyle = '#c9d1d9';
        ctx.font = '13px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(func.name, legendX + 40, legendY);

        legendY += 25;
      });
    }

  }, [mathCanvasState]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
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
