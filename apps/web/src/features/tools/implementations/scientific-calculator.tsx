import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type Token =
  | { kind: "number"; value: number }
  | { kind: "op"; value: string }
  | { kind: "func"; value: string }
  | { kind: "paren"; value: "(" | ")" };

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (ch === " ") { i++; continue; }
    if (/\d|\./.test(ch)) {
      let num = "";
      while (i < expr.length && /\d|\./.test(expr[i])) num += expr[i++];
      tokens.push({ kind: "number", value: parseFloat(num) });
      continue;
    }
    if (/[a-z]/.test(ch)) {
      let name = "";
      while (i < expr.length && /[a-z]/.test(expr[i])) name += expr[i++];
      tokens.push({ kind: "func", value: name });
      continue;
    }
    if (ch === "(" || ch === ")") {
      tokens.push({ kind: "paren", value: ch as "(" | ")" });
      i++;
      continue;
    }
    if ("+-*/^".includes(ch)) {
      tokens.push({ kind: "op", value: ch });
      i++;
      continue;
    }
    i++;
  }
  return tokens;
}

class Parser {
  private pos = 0;
  constructor(private tokens: Token[]) {}

  private peek(): Token | undefined { return this.tokens[this.pos]; }
  private consume(): Token { return this.tokens[this.pos++]; }

  parse(): number { return this.parseAddSub(); }

  private parseAddSub(): number {
    let left = this.parseMulDiv();
    while (this.peek()?.kind === "op" && (this.peek()?.value === "+" || this.peek()?.value === "-")) {
      const op = (this.consume() as { kind: "op"; value: string }).value;
      const right = this.parseMulDiv();
      left = op === "+" ? left + right : left - right;
    }
    return left;
  }

  private parseMulDiv(): number {
    let left = this.parsePow();
    while (this.peek()?.kind === "op" && (this.peek()?.value === "*" || this.peek()?.value === "/")) {
      const op = (this.consume() as { kind: "op"; value: string }).value;
      const right = this.parsePow();
      left = op === "*" ? left * right : left / right;
    }
    return left;
  }

  private parsePow(): number {
    const base = this.parseUnary();
    if (this.peek()?.kind === "op" && this.peek()?.value === "^") {
      this.consume();
      const exp = this.parsePow();
      return Math.pow(base, exp);
    }
    return base;
  }

  private parseUnary(): number {
    if (this.peek()?.kind === "op" && this.peek()?.value === "-") {
      this.consume();
      return -this.parsePrimary();
    }
    return this.parsePrimary();
  }

  private parsePrimary(): number {
    const tok = this.peek();
    if (!tok) throw new Error("Incomplete expression");

    if (tok.kind === "number") {
      this.consume();
      return tok.value;
    }

    if (tok.kind === "func") {
      this.consume();
      const arg = this.parsePrimary();
      switch (tok.value) {
        case "sin": return Math.sin(arg);
        case "cos": return Math.cos(arg);
        case "tan": return Math.tan(arg);
        case "log": return Math.log10(arg);
        case "ln": return Math.log(arg);
        case "sqrt": return Math.sqrt(arg);
        case "pi": return Math.PI;
        default: throw new Error(`Unknown function: ${tok.value}`);
      }
    }

    if (tok.kind === "paren" && tok.value === "(") {
      this.consume();
      const val = this.parseAddSub();
      if (this.peek()?.kind === "paren" && this.peek()?.value === ")") this.consume();
      return val;
    }

    throw new Error("Unexpected token");
  }
}

function safeEvaluate(expr: string): number {
  const processed = expr.replace(/π/g, "pi").replace(/×/g, "*").replace(/÷/g, "/");
  const tokens = tokenize(processed);
  const parser = new Parser(tokens);
  return parser.parse();
}

type HistoryEntry = { expr: string; result: string };

const BUTTON_ROWS = [
  ["sin(", "cos(", "tan(", "log(", "ln("],
  ["sqrt(", "x²", "π", "(", ")"],
  ["7", "8", "9", "/", "C"],
  ["4", "5", "6", "*", "⌫"],
  ["1", "2", "3", "-", "="],
  ["0", ".", "+"],
];

export function ScientificCalculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState("");

  function handleButton(label: string) {
    setError("");
    if (label === "C") { setExpression(""); setResult(""); return; }
    if (label === "⌫") { setExpression((e) => e.slice(0, -1)); return; }
    if (label === "=") {
      try {
        const r = safeEvaluate(expression);
        const resultStr = Number.isFinite(r) ? String(r) : "Error";
        setResult(resultStr);
        if (Number.isFinite(r)) {
          setHistory((h) => [{ expr: expression, result: resultStr }, ...h].slice(0, 20));
        }
      } catch {
        setError("Invalid expression");
      }
      return;
    }
    if (label === "x²") { setExpression((e) => `(${e})^2`); return; }
    if (label === "π") { setExpression((e) => e + "π"); return; }
    setExpression((e) => e + label);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Scientific Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-muted rounded-md p-4 space-y-1 min-h-[80px]">
            <div className="text-sm text-muted-foreground font-mono break-all min-h-[20px]">{expression || " "}</div>
            {error ? (
              <div className="text-destructive text-sm">{error}</div>
            ) : (
              <div className="text-3xl font-mono font-semibold text-right">{result}</div>
            )}
          </div>

          <div className="space-y-1.5">
            {BUTTON_ROWS.map((row, ri) => (
              <div key={ri} className="flex gap-1.5">
                {row.map((label) => (
                  <Button
                    key={label}
                    variant={["="].includes(label) ? "default" : ["C", "⌫"].includes(label) ? "destructive" : "outline"}
                    className="flex-1 text-sm h-11"
                    onClick={() => handleButton(label)}
                    aria-label={label}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base text-muted-foreground font-medium">History</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Calculations will appear here
            </p>
          ) : (
            <ScrollArea className="h-80">
              <div className="space-y-2">
                {history.map((entry, i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-full text-left rounded-md px-3 py-2 hover:bg-muted transition-colors"
                    onClick={() => { setExpression(entry.result); setResult(""); setError(""); }}
                  >
                    <div className="text-xs text-muted-foreground font-mono truncate">{entry.expr}</div>
                    <div className="text-sm font-mono font-semibold">= {entry.result}</div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
