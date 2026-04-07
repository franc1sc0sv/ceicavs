import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function generatePassword(
  length: number,
  useUpper: boolean,
  useLower: boolean,
  useNumbers: boolean,
  useSymbols: boolean
): string {
  let charset = "";
  if (useUpper) charset += UPPERCASE;
  if (useLower) charset += LOWERCASE;
  if (useNumbers) charset += NUMBERS;
  if (useSymbols) charset += SYMBOLS;
  if (charset === "") charset = LOWERCASE;

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (val) => charset[val % charset.length]).join("");
}

function getStrength(pwd: string): { label: string; color: string } {
  if (!pwd) return { label: "", color: "" };
  let score = 0;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 20) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 2) return { label: "Weak", color: "text-destructive" };
  if (score <= 4) return { label: "Moderate", color: "text-amber-500" };
  return { label: "Strong", color: "text-green-600" };
}

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  function handleGenerate() {
    const pwd = generatePassword(length, useUpper, useLower, useNumbers, useSymbols);
    setPassword(pwd);
    setCopied(false);
    setHistory((h) => [pwd, ...h].slice(0, 8));
  }

  function handleCopy(pwd: string) {
    navigator.clipboard.writeText(pwd).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const strength = getStrength(password);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Password Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Length</Label>
              <span className="text-sm font-mono font-semibold">{length}</span>
            </div>
            <Slider
              min={8}
              max={64}
              step={1}
              value={[length]}
              onValueChange={(val: number | readonly number[]) => {
                const v = Array.isArray(val) ? val[0] : val;
                setLength(v);
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>8</span>
              <span>64</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="upper"
                checked={useUpper}
                onCheckedChange={(v) => setUseUpper(v === true)}
              />
              <Label htmlFor="upper">Uppercase (A-Z)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="lower"
                checked={useLower}
                onCheckedChange={(v) => setUseLower(v === true)}
              />
              <Label htmlFor="lower">Lowercase (a-z)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="numbers"
                checked={useNumbers}
                onCheckedChange={(v) => setUseNumbers(v === true)}
              />
              <Label htmlFor="numbers">Numbers (0-9)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="symbols"
                checked={useSymbols}
                onCheckedChange={(v) => setUseSymbols(v === true)}
              />
              <Label htmlFor="symbols">Symbols (!@#$...)</Label>
            </div>
          </div>

          <Button onClick={handleGenerate} className="w-full">
            Generate
          </Button>

          {password && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={password}
                  className="font-mono text-sm"
                  aria-label="Generated password"
                />
                <Button
                  variant="outline"
                  onClick={() => handleCopy(password)}
                  aria-label="Copy password"
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              {strength.label && (
                <p className={`text-xs font-medium ${strength.color}`}>
                  Strength: {strength.label}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base text-muted-foreground font-medium">History</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Generated passwords will appear here
            </p>
          ) : (
            <div className="space-y-2">
              {history.map((pwd, i) => (
                <div key={i} className="flex items-center gap-2">
                  <code className="flex-1 truncate text-xs bg-muted rounded px-2 py-1.5 font-mono">
                    {pwd}
                  </code>
                  {i === 0 && (
                    <Badge variant="secondary" className="shrink-0 text-xs">Latest</Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 h-7 px-2 text-xs"
                    onClick={() => handleCopy(pwd)}
                  >
                    Copy
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
