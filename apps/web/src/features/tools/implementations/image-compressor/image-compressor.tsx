import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CompressedResult {
  url: string;
  sizeKb: number;
}

function formatKb(bytes: number): string {
  return (bytes / 1024).toFixed(1);
}

function reductionPercent(original: number, compressed: number): string {
  return (((original - compressed) / original) * 100).toFixed(1);
}

export function ImageCompressor() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [originalFileName, setOriginalFileName] = useState("imagen");
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState("");
  const [result, setResult] = useState<CompressedResult | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      setOriginalSize(file.size);
      setOriginalFileName(file.name.replace(/\.[^.]+$/, ""));
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        setOriginalUrl(src);
        setResult(null);
        compress(src, quality, maxWidth);
      };
      reader.readAsDataURL(file);
    },
    [quality, maxWidth]
  );

  function compress(src: string, q: number, mw: string) {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const targetWidth = mw && parseInt(mw) > 0 ? Math.min(img.width, parseInt(mw)) : img.width;
      const scale = targetWidth / img.width;
      canvas.width = targetWidth;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          setResult({ url, sizeKb: blob.size });
        },
        "image/jpeg",
        q / 100
      );
    };
    img.src = src;
  }

  function handleCompress() {
    if (!originalUrl) return;
    compress(originalUrl, quality, maxWidth);
  }

  function handleDownload() {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result.url;
    link.download = `${originalFileName}-comprimido.jpg`;
    link.click();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Compresor de Imágenes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragging ? "border-primary bg-primary/5" : "border-border"
          }`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label="Subir imagen"
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileRef.current?.click(); }}
        >
          <p className="text-muted-foreground text-sm">
            Arrastra una imagen aquí o haz clic para seleccionar
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Calidad: {quality}%</Label>
            <Slider
              min={10}
              max={100}
              step={1}
              value={[quality]}
              onValueChange={(v: number | readonly number[]) => {
                setQuality(Array.isArray(v) ? v[0] : v);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-width">Ancho máximo (px, opcional)</Label>
            <Input
              id="max-width"
              type="number"
              placeholder="Ej: 1200"
              value={maxWidth}
              onChange={(e) => setMaxWidth(e.target.value)}
            />
          </div>
        </div>

        {originalUrl && (
          <Button onClick={handleCompress} className="w-full">
            Comprimir
          </Button>
        )}

        {originalUrl && result && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Original</p>
                <img src={originalUrl} alt="Original" className="w-full rounded-md object-contain max-h-48 border" />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Comprimido</p>
                <img src={result.url} alt="Comprimido" className="w-full rounded-md object-contain max-h-48 border" />
              </div>
            </div>

            <div className="bg-muted rounded-md px-4 py-3 text-sm text-center">
              Original: <strong>{formatKb(originalSize)} KB</strong> → Comprimido:{" "}
              <strong>{formatKb(result.sizeKb)} KB</strong>{" "}
              <span className="text-green-600 font-medium">
                ({reductionPercent(originalSize, result.sizeKb)}% reducción)
              </span>
            </div>

            <Button onClick={handleDownload} variant="outline" className="w-full">
              Descargar imagen comprimida
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
