import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TimerState = "idle" | "running" | "paused" | "done";

const PRESETS = [
  { label: "1 min", seconds: 60 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
  { label: "15 min", seconds: 900 },
  { label: "30 min", seconds: 1800 },
  { label: "45 min", seconds: 2700 },
  { label: "1 hr", seconds: 3600 },
];

function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1);
  } catch {
    // AudioContext unavailable
  }
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function CountdownTimer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [state, setState] = useState<TimerState>("idle");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalConfigured = hours * 3600 + minutes * 60 + seconds;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  function handleStart() {
    const total = state === "idle" || state === "done" ? totalConfigured : remaining;
    if (total <= 0) return;
    setRemaining(total);
    setState("running");
    clearTimer();
    let left = total;
    intervalRef.current = setInterval(() => {
      left -= 1;
      setRemaining(left);
      if (left <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setState("done");
        playBeep();
      }
    }, 1000);
  }

  function handlePause() {
    clearTimer();
    setState("paused");
  }

  function handleReset() {
    clearTimer();
    setRemaining(0);
    setState("idle");
  }

  function handlePreset(sec: number) {
    clearTimer();
    setState("idle");
    setRemaining(0);
    setHours(Math.floor(sec / 3600));
    setMinutes(Math.floor((sec % 3600) / 60));
    setSeconds(sec % 60);
  }

  const display = state === "idle" || state === "done" ? totalConfigured : remaining;
  const displayH = Math.floor(display / 3600);
  const displayM = Math.floor((display % 3600) / 60);
  const displayS = display % 60;

  const timerColor =
    state === "done"
      ? "text-destructive"
      : state === "paused"
      ? "text-amber-500"
      : remaining <= 10 && state === "running"
      ? "text-destructive"
      : state === "running"
      ? "text-green-600"
      : "text-foreground";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Countdown Timer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Presets</Label>
            <div className="flex gap-2 flex-wrap">
              {PRESETS.map((p) => (
                <Button
                  key={p.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreset(p.seconds)}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="timer-h">Hours</Label>
              <Input
                id="timer-h"
                type="number"
                min={0}
                max={99}
                value={hours}
                onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                disabled={state === "running" || state === "paused"}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="timer-m">Minutes</Label>
              <Input
                id="timer-m"
                type="number"
                min={0}
                max={59}
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                disabled={state === "running" || state === "paused"}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="timer-s">Seconds</Label>
              <Input
                id="timer-s"
                type="number"
                min={0}
                max={59}
                value={seconds}
                onChange={(e) => setSeconds(Math.max(0, parseInt(e.target.value) || 0))}
                disabled={state === "running" || state === "paused"}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            {(state === "idle" || state === "done") && (
              <Button onClick={handleStart} disabled={totalConfigured === 0}>
                Start
              </Button>
            )}
            {state === "running" && (
              <Button variant="outline" onClick={handlePause}>
                Pause
              </Button>
            )}
            {state === "paused" && (
              <Button onClick={handleStart}>Resume</Button>
            )}
            {(state === "running" || state === "paused") && (
              <Button variant="destructive" onClick={handleReset}>
                Reset
              </Button>
            )}
            {state === "done" && (
              <Button variant="outline" onClick={handleReset}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardContent className="flex h-full min-h-64 flex-col items-center justify-center gap-4">
          <div
            className={`font-mono text-8xl font-bold tabular-nums transition-colors ${timerColor}`}
            aria-live="polite"
            aria-label={`${pad(displayH)}:${pad(displayM)}:${pad(displayS)}`}
          >
            {pad(displayH)}:{pad(displayM)}:{pad(displayS)}
          </div>
          {state === "done" && (
            <p className="text-destructive font-medium text-lg">Time's up!</p>
          )}
          {state === "running" && (
            <p className="text-sm text-muted-foreground">Running</p>
          )}
          {state === "paused" && (
            <p className="text-amber-500 text-sm font-medium">Paused</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
