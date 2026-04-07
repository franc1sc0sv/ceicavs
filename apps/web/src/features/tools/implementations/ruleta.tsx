import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "ceicavs-ruleta-options";

const SEGMENT_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899",
  "#f43f5e", "#06b6d4", "#84cc16", "#a855f7",
];

const PRESETS: { label: string; items: string[] }[] = [
  { label: "Números 1-10", items: Array.from({ length: 10 }, (_, i) => String(i + 1)) },
  { label: "Días de la semana", items: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] },
  { label: "Meses del año", items: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"] },
];

function loadOptions(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveOptions(options: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
}

function drawWheel(canvas: HTMLCanvasElement, options: string[], rotation: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx || options.length === 0) return;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = cx - 10;
  const arc = (2 * Math.PI) / options.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  options.forEach((label, i) => {
    const startAngle = rotation + i * arc;
    const endAngle = startAngle + arc;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startAngle + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${Math.max(10, Math.min(14, 80 / options.length))}px sans-serif`;
    const maxLen = 12;
    const displayLabel = label.length > maxLen ? label.slice(0, maxLen) + "…" : label;
    ctx.fillText(displayLabel, radius - 10, 5);
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(cx, cy, 16, 0, 2 * Math.PI);
  ctx.fillStyle = "#1e293b";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx + radius - 10, cy);
  ctx.lineTo(cx + radius + 14, cy - 10);
  ctx.lineTo(cx + radius + 14, cy + 10);
  ctx.closePath();
  ctx.fillStyle = "#1e293b";
  ctx.fill();
}

export function Ruleta() {
  const [options, setOptions] = useState<string[]>(() => loadOptions());
  const [inputValue, setInputValue] = useState("");
  const [winner, setWinner] = useState("");
  const [spinning, setSpinning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    saveOptions(options);
  }, [options]);

  const render = useCallback(() => {
    if (canvasRef.current) {
      drawWheel(canvasRef.current, options, rotationRef.current);
    }
  }, [options]);

  useEffect(() => {
    render();
  }, [render]);

  function addOption() {
    const val = inputValue.trim();
    if (!val) return;
    setOptions((prev) => [...prev, val]);
    setInputValue("");
  }

  function removeOption(index: number) {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  }

  function applyPreset(items: string[]) {
    setOptions(items);
    setWinner("");
  }

  function spin() {
    if (spinning || options.length < 2) return;
    setSpinning(true);
    setWinner("");

    const extraSpins = 5 + Math.random() * 5;
    const stopAt = Math.random() * 2 * Math.PI;
    const totalRotation = extraSpins * 2 * Math.PI + stopAt;
    const duration = 3000;
    const start = performance.now();
    const startRotation = rotationRef.current;

    function easeOut(t: number): number {
      return 1 - Math.pow(1 - t, 3);
    }

    function frame(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      rotationRef.current = startRotation + totalRotation * easeOut(t);
      render();

      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        setSpinning(false);
        const arc = (2 * Math.PI) / options.length;
        const normalizedAngle = ((2 * Math.PI - (rotationRef.current % (2 * Math.PI))) % (2 * Math.PI));
        const winnerIdx = Math.floor(normalizedAngle / arc) % options.length;
        setWinner(options[winnerIdx]);
      }
    }

    rafRef.current = requestAnimationFrame(frame);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ruleta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p) => (
            <Button key={p.label} variant="outline" size="sm" onClick={() => applyPreset(p.items)}>
              {p.label}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="flex-1 space-y-1">
            <Label htmlFor="ruleta-input">Agregar opción</Label>
            <Input
              id="ruleta-input"
              placeholder="Nueva opción..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addOption(); }}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={addOption} variant="outline">Agregar</Button>
          </div>
        </div>

        {options.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {options.map((opt, i) => (
              <Badge key={i} variant="secondary" className="gap-1">
                {opt}
                <button
                  onClick={() => removeOption(i)}
                  className="ml-1 hover:text-destructive"
                  aria-label={`Eliminar ${opt}`}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={320}
              height={320}
              className="rounded-full"
              aria-label="Ruleta"
            />
          </div>

          <Button
            onClick={spin}
            disabled={spinning || options.length < 2}
            size="lg"
            className="px-8"
          >
            {spinning ? "Girando..." : "Girar"}
          </Button>
        </div>

        {winner && !spinning && (
          <div className="text-center py-4 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground mb-1">Resultado</p>
            <p className="text-3xl font-bold">{winner}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
