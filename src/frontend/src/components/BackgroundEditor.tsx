import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as Tabs from "@radix-ui/react-tabs";
import { ImagePlus, Loader2, Sparkles, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const PRESET_COLORS = [
  { hex: "#FFFFFF", label: "White" },
  { hex: "#F0F0F0", label: "Light Gray" },
  { hex: "#808080", label: "Mid Gray" },
  { hex: "#404040", label: "Dark Gray" },
  { hex: "#000000", label: "Black" },
  { hex: "#1a237e", label: "Navy" },
  { hex: "#1565C0", label: "Royal Blue" },
  { hex: "#006064", label: "Teal" },
  { hex: "#1B5E20", label: "Forest Green" },
  { hex: "#4A148C", label: "Deep Purple" },
  { hex: "#F5F0E8", label: "Warm Beige" },
  { hex: "#FCE4EC", label: "Soft Pink" },
];

const PRESET_IMAGES = [
  { url: "https://picsum.photos/seed/forest/1920/1080", label: "Forest" },
  { url: "https://picsum.photos/seed/mountain/1920/1080", label: "Mountains" },
  { url: "https://picsum.photos/seed/ocean/1920/1080", label: "Ocean" },
  {
    url: "https://picsum.photos/seed/citynight/1920/1080",
    label: "City Night",
  },
  {
    url: "https://picsum.photos/seed/abstractblue/1920/1080",
    label: "Abstract Blue",
  },
  { url: "https://picsum.photos/seed/sunset/1920/1080", label: "Sunset" },
  { url: "https://picsum.photos/seed/studio/1920/1080", label: "Studio Gray" },
  { url: "https://picsum.photos/seed/bokeh/1920/1080", label: "Bokeh" },
];

type BgSource =
  | { type: "none" }
  | { type: "color"; hex: string }
  | { type: "image"; url: string };

interface BackgroundEditorProps {
  processedUrl: string;
  onComposited: (compositedUrl: string) => void;
}

export function applyBackground(
  processedUrl: string,
  bg: BgSource,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const subject = new Image();
    subject.crossOrigin = "anonymous";
    subject.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = subject.naturalWidth;
      canvas.height = subject.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("No canvas context"));

      const drawSubjectAndResolve = () => {
        ctx.drawImage(subject, 0, 0);
        resolve(canvas.toDataURL("image/png", 0.95));
      };

      if (bg.type === "color") {
        ctx.fillStyle = bg.hex;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawSubjectAndResolve();
      } else if (bg.type === "image") {
        const bgImg = new Image();
        bgImg.crossOrigin = "anonymous";
        bgImg.onload = () => {
          // Cover-scale: fill canvas, center
          const scaleX = canvas.width / bgImg.naturalWidth;
          const scaleY = canvas.height / bgImg.naturalHeight;
          const scale = Math.max(scaleX, scaleY);
          const dw = bgImg.naturalWidth * scale;
          const dh = bgImg.naturalHeight * scale;
          const dx = (canvas.width - dw) / 2;
          const dy = (canvas.height - dh) / 2;
          ctx.drawImage(bgImg, dx, dy, dw, dh);
          drawSubjectAndResolve();
        };
        bgImg.onerror = reject;
        bgImg.src = bg.url;
      } else {
        drawSubjectAndResolve();
      }
    };
    subject.onerror = reject;
    subject.src = processedUrl;
  });
}

export default function BackgroundEditor({
  processedUrl,
  onComposited,
}: BackgroundEditorProps) {
  const [activeTab, setActiveTab] = useState("colors");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [customHex, setCustomHex] = useState("#7C3AED");
  // appliedCustomHex tracks the last APPLIED custom color so the useEffect
  // can re-apply it when processedUrl changes without losing the value.
  const [appliedCustomHex, setAppliedCustomHex] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiImageUrl, setAiImageUrl] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const applyAndNotify = useCallback(
    async (bg: BgSource) => {
      try {
        const composited = await applyBackground(processedUrl, bg);
        onComposited(composited);
      } catch {
        // fail silently — preview stays as-is
      }
    },
    [processedUrl, onComposited],
  );

  // When a preset color is selected
  const handleColorSelect = (hex: string) => {
    setSelectedColor(hex);
    setSelectedImageUrl(null);
    setUploadedImageUrl(null);
    setAiImageUrl(null);
    void applyAndNotify({ type: "color", hex });
  };

  // Custom color change — updates the preview swatch but does NOT apply
  const handleCustomColorChange = (hex: string) => {
    setCustomHex(hex);
  };

  // Apply custom color — commits it as the active background
  const applyCustomColor = (hex: string) => {
    setAppliedCustomHex(hex);
    setSelectedColor(null);
    setSelectedImageUrl(null);
    setUploadedImageUrl(null);
    setAiImageUrl(null);
    void applyAndNotify({ type: "color", hex });
  };

  // Preset image selected
  const handlePresetImage = (url: string) => {
    setSelectedImageUrl(url);
    setSelectedColor(null);
    setUploadedImageUrl(null);
    setAiImageUrl(null);
    void applyAndNotify({ type: "image", url });
  };

  // Upload image
  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setUploadedImageUrl(objectUrl);
    setSelectedColor(null);
    setSelectedImageUrl(null);
    setAiImageUrl(null);
    void applyAndNotify({ type: "image", url: objectUrl });
  };

  // AI Generate
  const handleAiGenerate = () => {
    const trimmed = aiPrompt.trim();
    if (!trimmed) return;
    setAiLoading(true);
    setAiError(null);
    setAiImageUrl(null);
    const encoded = encodeURIComponent(trimmed);
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=1920&height=1080&nologo=true`;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setAiImageUrl(url);
      setAiLoading(false);
      setSelectedColor(null);
      setSelectedImageUrl(null);
      setUploadedImageUrl(null);
      void applyAndNotify({ type: "image", url });
    };
    img.onerror = () => {
      setAiLoading(false);
      setAiError(
        "Failed to generate image. Please try a different description.",
      );
    };
    img.src = url;
  };

  // When processedUrl changes, re-apply whichever background is currently active.
  // Custom color uses appliedCustomHex (not customHex) so partial/typing state never
  // overwrites a committed selection.
  useEffect(() => {
    if (selectedColor)
      void applyAndNotify({ type: "color", hex: selectedColor });
    else if (appliedCustomHex)
      void applyAndNotify({ type: "color", hex: appliedCustomHex });
    else if (selectedImageUrl)
      void applyAndNotify({ type: "image", url: selectedImageUrl });
    else if (uploadedImageUrl)
      void applyAndNotify({ type: "image", url: uploadedImageUrl });
    else if (aiImageUrl)
      void applyAndNotify({ type: "image", url: aiImageUrl });
    else void applyAndNotify({ type: "none" });
  }, [
    applyAndNotify,
    selectedColor,
    appliedCustomHex,
    selectedImageUrl,
    uploadedImageUrl,
    aiImageUrl,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-2xl border border-border/60 bg-card shadow-card overflow-hidden h-full flex flex-col"
      data-ocid="bg-editor.panel"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/50 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <ImagePlus className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground text-base leading-tight">
            Change Background
          </h3>
          <p className="text-xs text-muted-foreground font-body">
            Replace the transparent background with a color, image, or AI scene
          </p>
        </div>
      </div>

      <Tabs.Root
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col flex-1 min-h-0"
      >
        {/* Tab bar */}
        <Tabs.List className="flex border-b border-border/50 bg-card px-2 overflow-x-auto scrollbar-none">
          {[
            { value: "colors", label: "Colors" },
            { value: "custom", label: "Custom Color" },
            { value: "presets", label: "Preset Images" },
            { value: "upload", label: "Upload" },
            { value: "ai", label: "AI Generate" },
          ].map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              data-ocid={`bg-editor.${tab.value}-tab`}
              className={[
                "relative shrink-0 px-4 py-3 text-sm font-semibold font-body transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:transition-all after:duration-200",
                activeTab === tab.value
                  ? "text-primary after:bg-primary"
                  : "text-muted-foreground hover:text-foreground after:bg-transparent",
              ].join(" ")}
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* ── TAB 1: Colors ── */}
        <Tabs.Content
          value="colors"
          className="p-6 focus-visible:outline-none overflow-y-auto"
        >
          <p className="text-xs text-muted-foreground font-body mb-4">
            Select a professional preset color as your background.
          </p>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2.5">
            {PRESET_COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                title={c.label}
                aria-label={c.label}
                data-ocid={`bg-editor.color-${c.label.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => handleColorSelect(c.hex)}
                className={[
                  "w-9 h-9 rounded-xl border-2 transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  selectedColor === c.hex
                    ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card scale-110"
                    : "border-border/60 hover:border-primary/50",
                ].join(" ")}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
          {selectedColor && (
            <p className="text-xs text-primary mt-3 font-body">
              Selected:{" "}
              {PRESET_COLORS.find((c) => c.hex === selectedColor)?.label ??
                selectedColor}
            </p>
          )}
        </Tabs.Content>

        {/* ── TAB 2: Custom Color ── */}
        <Tabs.Content
          value="custom"
          className="p-6 focus-visible:outline-none overflow-y-auto"
        >
          <div className="flex flex-col gap-5">
            <p className="text-xs text-muted-foreground font-body">
              Pick any color using the wheel or type a hex value.
            </p>
            {/* Large color swatch + picker */}
            <div className="flex items-start gap-5">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-24 h-24 rounded-2xl border-2 border-border/60 shadow-card flex-shrink-0 transition-colors duration-200"
                  style={{ backgroundColor: customHex }}
                  aria-label="Color preview swatch"
                />
                <span className="text-xs font-mono text-muted-foreground">
                  {customHex.toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col gap-3 pt-1">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground font-body uppercase tracking-wider">
                    Color wheel
                  </Label>
                  <input
                    type="color"
                    value={customHex.length === 7 ? customHex : "#7C3AED"}
                    data-ocid="bg-editor.custom-color-picker"
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    className="w-16 h-12 cursor-pointer rounded-xl border-2 border-border/60 bg-transparent p-0.5 hover:border-primary/60 transition-colors"
                    aria-label="Color picker wheel"
                  />
                  <p className="text-xs text-muted-foreground font-body mt-1">
                    Click{" "}
                    <span className="font-semibold text-foreground">
                      Apply Color
                    </span>{" "}
                    to set
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground font-body uppercase tracking-wider">
                    Hex value
                  </Label>
                  <Input
                    type="text"
                    value={customHex}
                    maxLength={7}
                    data-ocid="bg-editor.custom-color-input"
                    onChange={(e) => {
                      const v = e.target.value.trim();
                      // Allow partial typing: # and up to 6 hex chars
                      if (!/^#[0-9A-Fa-f]{0,6}$/.test(v) && v !== "") return;
                      const normalized = v.startsWith("#") ? v : `#${v}`;
                      setCustomHex(normalized);
                      // Expand 3-digit shorthand to 6-digit for swatch preview only
                      const expand3 =
                        /^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/.exec(
                          normalized,
                        );
                      if (expand3) {
                        const full = `#${expand3[1]}${expand3[1]}${expand3[2]}${expand3[2]}${expand3[3]}${expand3[3]}`;
                        setCustomHex(full);
                      }
                    }}
                    onBlur={() => {
                      // On blur, expand 3-digit shorthand for swatch display only
                      const expand3 =
                        /^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/.exec(
                          customHex,
                        );
                      if (expand3) {
                        const full = `#${expand3[1]}${expand3[1]}${expand3[2]}${expand3[2]}${expand3[3]}${expand3[3]}`;
                        setCustomHex(full);
                      }
                    }}
                    placeholder="#7C3AED"
                    className="font-mono text-sm w-36"
                  />
                </div>
              </div>
            </div>
            <Button
              type="button"
              data-ocid="bg-editor.custom-color-apply"
              onClick={() => applyCustomColor(customHex)}
              disabled={customHex.length !== 7}
              className="w-fit bg-primary hover:bg-primary/90 text-primary-foreground font-display font-semibold transition-smooth"
            >
              Apply Color
            </Button>
            {appliedCustomHex && (
              <p className="text-xs text-primary font-body">
                Applied:{" "}
                <span className="font-mono">
                  {appliedCustomHex.toUpperCase()}
                </span>
              </p>
            )}
          </div>
        </Tabs.Content>

        {/* ── TAB 3: Preset Images ── */}
        <Tabs.Content
          value="presets"
          className="p-6 focus-visible:outline-none overflow-y-auto"
        >
          <p className="text-xs text-muted-foreground font-body mb-4">
            Choose a professional background photo.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRESET_IMAGES.map((img) => (
              <button
                key={img.url}
                type="button"
                title={img.label}
                aria-label={`Use ${img.label} as background`}
                data-ocid={`bg-editor.preset-${img.label.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => handlePresetImage(img.url)}
                className={[
                  "relative rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary aspect-video",
                  selectedImageUrl === img.url
                    ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card"
                    : "border-border/50 hover:border-primary/50",
                ].join(" ")}
              >
                <img
                  src={`https://picsum.photos/seed/${img.url.split("/seed/")[1]?.split("/")[0] ?? "forest"}/320/180`}
                  alt={img.label}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
                  <span className="text-[10px] font-semibold text-white font-body">
                    {img.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Tabs.Content>

        {/* ── TAB 4: Upload ── */}
        <Tabs.Content
          value="upload"
          className="p-6 focus-visible:outline-none overflow-y-auto"
        >
          <div className="flex flex-col gap-5 items-start">
            <div className="flex items-center gap-4">
              <button
                type="button"
                data-ocid="bg-editor.upload-button"
                onClick={() => uploadInputRef.current?.click()}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/70 text-primary font-semibold font-display text-sm transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Upload className="w-4 h-4" />
                Upload Background Image
              </button>
              <span className="text-xs text-muted-foreground font-body">
                JPG, PNG, WebP accepted
              </span>
            </div>
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              data-ocid="bg-editor.upload-input"
              onChange={handleUploadChange}
            />
            {uploadedImageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-2"
              >
                <span className="text-xs text-muted-foreground font-body">
                  Uploaded background preview:
                </span>
                <div className="w-48 aspect-video rounded-xl overflow-hidden border-2 border-primary ring-2 ring-primary ring-offset-2 ring-offset-card">
                  <img
                    src={uploadedImageUrl}
                    alt="Uploaded background"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </Tabs.Content>

        {/* ── TAB 5: AI Generate ── */}
        <Tabs.Content
          value="ai"
          className="p-6 focus-visible:outline-none overflow-y-auto"
        >
          <div className="flex flex-col gap-5">
            {/* Attribution note */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-semibold font-body text-accent">
                Powered by Pollinations.ai · Free · No account needed
              </span>
            </div>

            <div className="flex flex-col gap-2 max-w-lg">
              <Label className="text-xs font-semibold text-muted-foreground font-body uppercase tracking-wider">
                Describe your background scene
              </Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={aiPrompt}
                  data-ocid="bg-editor.ai-prompt-input"
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAiGenerate();
                  }}
                  placeholder="e.g. Sunset over mountains, golden hour, cinematic"
                  className="flex-1 font-body text-sm"
                  disabled={aiLoading}
                />
                <Button
                  type="button"
                  data-ocid="bg-editor.ai-generate-button"
                  onClick={handleAiGenerate}
                  disabled={aiLoading || !aiPrompt.trim()}
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-display font-semibold transition-smooth shrink-0"
                >
                  {aiLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {aiLoading ? "Generating…" : "Generate"}
                </Button>
              </div>
            </div>

            {/* Loading state */}
            {aiLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                data-ocid="bg-editor.ai-loading-state"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20"
              >
                <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
                <div>
                  <p className="text-sm font-semibold font-display text-foreground">
                    Generating your background…
                  </p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">
                    This can take 10–30 seconds
                  </p>
                </div>
              </motion.div>
            )}

            {/* Error */}
            {aiError && (
              <p
                data-ocid="bg-editor.ai-error-state"
                className="text-sm text-destructive font-body"
              >
                {aiError}
              </p>
            )}

            {/* Result preview */}
            {aiImageUrl && !aiLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                data-ocid="bg-editor.ai-success-state"
                className="flex flex-col gap-2"
              >
                <span className="text-xs text-muted-foreground font-body">
                  Generated background:
                </span>
                <div className="max-w-xs aspect-video rounded-xl overflow-hidden border-2 border-primary ring-2 ring-primary ring-offset-2 ring-offset-card">
                  <img
                    src={aiImageUrl}
                    alt="AI generated background"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </motion.div>
  );
}
