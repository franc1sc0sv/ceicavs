import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ImageFormat = "png" | "jpeg" | "webp";

const FORMAT_OPTIONS: { label: string; value: ImageFormat; mime: string }[] = [
  { label: "PNG", value: "png", mime: "image/png" },
  { label: "JPEG", value: "jpeg", mime: "image/jpeg" },
  { label: "WebP", value: "webp", mime: "image/webp" },
];

export function ImageFormatConverter() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [originalName, setOriginalName] = useState("imagen");
  const [format, setFormat] = useState<ImageFormat>("png");
  const [quality, setQuality] = useState(90);
  const [convertedUrl, setConvertedUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(file: File) {
    if (!file.type.startsWith("image/")) return;
    setOriginalName(file.name.replace(/\.[^.]+$/, ""));
    setConvertedUrl("");
    const reader = new FileReader();
    reader.onload = (e) => setOriginalUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleConvert() {
    if (!originalUrl) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const mime = FORMAT_OPTIONS.find((f) => f.value === format)?.mime ?? "image/png";
      const q = format === "png" ? undefined : quality / 100;
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          setConvertedUrl(URL.createObjectURL(blob));
        },
        mime,
        q
      );
    };
    img.src = originalUrl;
  }

  function handleDownload() {
    if (!convertedUrl) return;
    const link = document.createElement("a");
    link.href = convertedUrl;
    link.download = `${originalName}.${format}`;
    link.click();
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Convertidor de Formato de Imagen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          onClick={() => fileRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Seleccionar imagen"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
          }}
        >
          <p className="text-muted-foreground text-sm">
            {originalUrl ? "Cambiar imagen" : "Haz clic para seleccionar una imagen"}
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileChange(f);
            }}
          />
        </div>

        {originalUrl && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Original</p>
            <img
              src={originalUrl}
              alt="Imagen original"
              className="w-full max-h-48 object-contain rounded-md border"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Formato de salida</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as ImageFormat)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMAT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {format !== "png" && (
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
          )}
        </div>

        <Button onClick={handleConvert} disabled={!originalUrl} className="w-full">
          Convertir
        </Button>

        {convertedUrl && (
          <>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Resultado</p>
              <img
                src={convertedUrl}
                alt="Imagen convertida"
                className="w-full max-h-48 object-contain rounded-md border"
              />
            </div>
            <Button onClick={handleDownload} variant="outline" className="w-full">
              Descargar como .{format}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
