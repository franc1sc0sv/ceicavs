import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type QrSize = 128 | 256 | 384;

const SIZE_OPTIONS: { label: string; value: QrSize }[] = [
  { label: "Small (128px)", value: 128 },
  { label: "Medium (256px)", value: 256 },
  { label: "Large (384px)", value: 384 },
];

export function QrCodeGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState<QrSize>(256);
  const canvasRef = useRef<HTMLDivElement>(null);

  function handleDownload() {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "qrcode.png";
    link.click();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="qr-text">Text or URL</Label>
            <Input
              id="qr-text"
              placeholder="https://example.com"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Size</Label>
            <div className="flex gap-2 flex-wrap">
              {SIZE_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  variant={size === opt.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSize(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleDownload}
            disabled={!text.trim()}
            className="w-full"
          >
            Download PNG
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardContent className="flex h-full min-h-64 items-center justify-center py-10">
          {text.trim() ? (
            <div ref={canvasRef} className="p-4 bg-white rounded-lg border">
              <QRCodeCanvas
                value={text.trim()}
                size={size}
                level="M"
                includeMargin={false}
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              Enter text or URL to preview the QR code
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
