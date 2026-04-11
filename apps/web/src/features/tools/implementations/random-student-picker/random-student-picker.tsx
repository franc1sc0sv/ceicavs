import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const STORAGE_KEY = "ceicavs-student-names";

function loadNames(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveNames(names: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
}

export function RandomStudentPicker() {
  const [text, setText] = useState(() => loadNames().join("\n"));
  const [selected, setSelected] = useState("");
  const [noRepeat, setNoRepeat] = useState(false);
  const [pool, setPool] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);
  const animFrameRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const names = text
    .split("\n")
    .map((n) => n.trim())
    .filter(Boolean);

  useEffect(() => {
    saveNames(names);
  }, [names]);

  useEffect(() => {
    setPool(names);
  }, [text]);

  function runShuffleAnimation(finalName: string, currentPool: string[]) {
    setAnimating(true);
    const duration = 1800;
    const start = Date.now();
    let interval = 60;

    function tick() {
      const elapsed = Date.now() - start;
      if (elapsed >= duration) {
        setSelected(finalName);
        setAnimating(false);
        return;
      }
      const progress = elapsed / duration;
      const randomName = currentPool[Math.floor(Math.random() * currentPool.length)];
      setSelected(randomName);
      interval = 60 + progress * 300;
      animFrameRef.current = setTimeout(tick, interval);
    }

    tick();
  }

  function handlePick() {
    if (animating) return;
    const source = noRepeat && pool.length > 0 ? pool : names;
    if (source.length === 0) return;

    const idx = Math.floor(Math.random() * source.length);
    const winner = source[idx];

    if (noRepeat) {
      const newPool = source.filter((_, i) => i !== idx);
      setPool(newPool.length === 0 ? names : newPool);
    }

    runShuffleAnimation(winner, source);
    setHistory((h) => [winner, ...h].slice(0, 10));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Random Student Picker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="student-names">Names (one per line)</Label>
            <Textarea
              id="student-names"
              rows={10}
              placeholder="María García&#10;Juan Pérez&#10;Sofía López"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">{names.length} student(s)</p>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="no-repeat"
              checked={noRepeat}
              onCheckedChange={(v) => setNoRepeat(v === true)}
            />
            <Label htmlFor="no-repeat">No repeat until list is exhausted</Label>
          </div>

          <Button
            onClick={handlePick}
            disabled={names.length === 0 || animating}
            className="w-full"
          >
            Pick
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        <Card className="w-full flex-1">
          <CardContent className="flex h-full min-h-48 flex-col items-center justify-center py-10">
            {selected ? (
              <>
                <p className="mb-3 text-sm text-muted-foreground">Selected</p>
                <p
                  className={`text-5xl font-bold transition-all ${
                    animating ? 'scale-95 opacity-60' : 'scale-100 opacity-100'
                  }`}
                >
                  {selected}
                </p>
                {noRepeat && (
                  <p className="mt-4 text-xs text-muted-foreground">
                    {pool.length} remaining in pool
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Add names and press Pick
              </p>
            )}
          </CardContent>
        </Card>

        {history.length > 0 && (
          <Card className="w-full">
            <CardContent className="pt-6 space-y-2">
              <Label>Recent history</Label>
              <div className="flex flex-wrap gap-2">
                {history.map((name, i) => (
                  <Badge key={i} variant={i === 0 ? 'default' : 'secondary'}>
                    {name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
