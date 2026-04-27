import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pencil, Download, Upload, RotateCcw, LogOut, X, Image as ImageIcon,
  Settings, Move, Loader2, Check,
} from "lucide-react";
import { useEditor } from "@/lib/editor/EditorContext";
import { exportJSON, importJSON, uploadImageToCloud } from "@/lib/editor/storage";
import { toast } from "@/hooks/use-toast";

interface Selected {
  kind: "text" | "image" | null;
  key: string;
  initialFontSize?: string;
  initialColor?: string;
  imageSrc?: string;
  rect?: { left: number; top: number; right: number; bottom: number; width: number; height: number };
}

const PANEL_W = 320;
const PANEL_H_EST = 460;
const MARGIN = 16;

export function EditorPanel() {
  const {
    editing, lock, data, currentSlide, saving,
    updateText, updateImage, resetAll, reload,
  } = useEditor();

  const [selected, setSelected] = useState<Selected>({ kind: null, key: "" });
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const [showTools, setShowTools] = useState(false); // 设置面板(导出/重置/退出)
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importJsonRef = useRef<HTMLInputElement>(null);
  const dragStateRef = useRef<{ dx: number; dy: number } | null>(null);

  // 计算自动避让位置
  const computeAutoPos = useCallback((rect?: Selected["rect"]) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (!rect) {
      return { left: vw - PANEL_W - MARGIN, top: 80 };
    }
    // 优先放右侧，其次左侧，再次下方
    const spaceRight = vw - rect.right;
    const spaceLeft = rect.left;
    let left: number;
    let top = Math.max(MARGIN, Math.min(rect.top, vh - PANEL_H_EST - MARGIN));
    if (spaceRight >= PANEL_W + MARGIN * 2) {
      left = rect.right + MARGIN;
    } else if (spaceLeft >= PANEL_W + MARGIN * 2) {
      left = rect.left - PANEL_W - MARGIN;
    } else {
      // 上方或下方
      left = Math.max(MARGIN, Math.min(rect.left, vw - PANEL_W - MARGIN));
      const spaceBelow = vh - rect.bottom;
      if (spaceBelow >= PANEL_H_EST + MARGIN) {
        top = rect.bottom + MARGIN;
      } else {
        top = Math.max(MARGIN, rect.top - PANEL_H_EST - MARGIN);
      }
    }
    return { left, top };
  }, []);

  // 暴露给外部 (slide stage) 的两个回调
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    w.__editorSelectImage = (key: string, src: string, el?: HTMLElement) => {
      const r = el?.getBoundingClientRect();
      const rect = r ? { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height } : undefined;
      setSelected({ kind: "image", key, imageSrc: src, rect });
      setPos(computeAutoPos(rect));
    };
    w.__editorSelectText = (key: string, el: HTMLElement) => {
      const cs = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const rect = { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
      setSelected({
        kind: "text", key,
        initialFontSize: cs.fontSize,
        initialColor: rgbToHex(cs.color),
        rect,
      });
      setPos(computeAutoPos(rect));
    };
    return () => {
      delete w.__editorSelectImage;
      delete w.__editorSelectText;
    };
  }, [computeAutoPos]);

  // 切换 slide 时清空选中
  useEffect(() => { setSelected({ kind: null, key: "" }); setPos(null); setShowTools(false); }, [currentSlide]);

  // 拖拽
  const onDragStart = (e: React.MouseEvent) => {
    if (!pos) return;
    dragStateRef.current = { dx: e.clientX - pos.left, dy: e.clientY - pos.top };
    const onMove = (ev: MouseEvent) => {
      const ds = dragStateRef.current;
      if (!ds) return;
      const left = Math.max(0, Math.min(window.innerWidth - PANEL_W, ev.clientX - ds.dx));
      const top = Math.max(0, Math.min(window.innerHeight - 60, ev.clientY - ds.dy));
      setPos({ left, top });
    };
    const onUp = () => {
      dragStateRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  if (!editing) return null;

  const slideOv = data.slides[currentSlide] ?? { texts: {}, images: {} };
  const currentTextOv = selected.kind === "text" ? slideOv.texts[selected.key] : undefined;

  const handleImageFile = async (file: File) => {
    if (!selected.key) return;
    if (file.size > 20 * 1024 * 1024) {
      toast({ title: "图片过大", description: "请选择小于 20MB 的图片", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImageToCloud(file, currentSlide, selected.key);
      updateImage(currentSlide, selected.key, { src: url });
      setSelected((s) => ({ ...s, imageSrc: url }));
      toast({ title: "✓ 图片已上传", description: "已保存到云端,刷新也不会丢失" });
    } catch (err) {
      console.error("上传失败:", err);
      toast({
        title: "上传失败",
        description: err instanceof Error ? err.message : "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // 浮动小按钮（无选中且未打开工具时）
  const showFloatingBar = selected.kind === null && !showTools;

  if (showFloatingBar) {
    return (
      <div className="fixed bottom-4 right-4 z-[60] flex items-center gap-2 bg-background border-2 border-primary/40 rounded-full shadow-2xl px-3 py-2">
        <Pencil className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium">编辑模式 · 第 {currentSlide + 1} 页 · 点击文字或图片</span>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setShowTools(true)} title="工具">
          <Settings className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={lock} title="退出编辑">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  // 工具面板（导出/重置）—— 位于右下角
  if (showTools && selected.kind === null) {
    return (
      <aside className="fixed bottom-4 right-4 w-80 z-[60] bg-background border-2 border-primary/30 rounded-lg shadow-2xl text-foreground">
        <header className="flex items-center justify-between px-4 py-3 border-b bg-primary/5">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            <span className="font-bold text-sm">编辑工具</span>
          </div>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setShowTools(false)}>
            <X className="w-4 h-4" />
          </Button>
        </header>
        <div className="p-4 space-y-3">
          <div className="text-xs text-muted-foreground">点击页面任意文字/图片即可编辑</div>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" onClick={() => exportJSON(data)}>
              <Download className="w-3 h-3 mr-1" /> 导出
            </Button>
            <Button size="sm" variant="outline" onClick={() => importJsonRef.current?.click()}>
              <Upload className="w-3 h-3 mr-1" /> 导入
            </Button>
            <input ref={importJsonRef} type="file" accept="application/json" hidden
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                try {
                  const next = await importJSON(f);
                  reload(next);
                  toast({ title: "✓ 内容已导入" });
                } catch {
                  toast({ title: "导入失败", description: "文件格式不正确", variant: "destructive" });
                }
                e.target.value = "";
              }} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="text-destructive"
              onClick={() => { if (confirm("确定要清空全部修改？")) resetAll(); }}>
              <RotateCcw className="w-3 h-3 mr-1" /> 重置全部
            </Button>
            <Button size="sm" variant="outline" onClick={lock}>
              <LogOut className="w-3 h-3 mr-1" /> 退出
            </Button>
          </div>
        </div>
      </aside>
    );
  }

  // 选中元素后：智能位置 + 可拖动
  const style: React.CSSProperties = pos
    ? { left: pos.left, top: pos.top, width: PANEL_W }
    : { right: 16, top: 80, width: PANEL_W };

  return (
    <aside
      className="fixed z-[60] bg-background border-2 border-primary/30 rounded-lg shadow-2xl flex flex-col text-foreground max-h-[80vh]"
      style={style}
    >
      <header
        className="flex items-center justify-between px-4 py-3 border-b bg-primary/5 cursor-move select-none"
        onMouseDown={onDragStart}
      >
        <div className="flex items-center gap-2">
          <Move className="w-3 h-3 text-muted-foreground" />
          <Pencil className="w-4 h-4 text-primary" />
          <span className="font-bold text-sm">
            {selected.kind === "text" ? "编辑文字" : "编辑图片"}
          </span>
        </div>
        <Button size="icon" variant="ghost" className="h-7 w-7"
          onClick={() => { setSelected({ kind: null, key: "" }); setPos(null); }}
          aria-label="关闭">
          <X className="w-4 h-4" />
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selected.kind === "text" && (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground">在页面上直接点击修改文字内容</div>

            <div className="space-y-1.5">
              <Label className="text-xs">字号</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder={selected.initialFontSize}
                  value={currentTextOv?.fontSize ?? ""}
                  onChange={(e) => updateText(currentSlide, selected.key, { fontSize: e.target.value })}
                />
                <Button
                  variant="outline" size="sm"
                  onClick={() => updateText(currentSlide, selected.key, { fontSize: undefined })}
                  title="恢复默认"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {["20px", "28px", "36px", "48px", "64px", "96px"].map((sz) => (
                  <Button key={sz} variant="outline" size="sm" className="h-7 text-xs px-2"
                    onClick={() => updateText(currentSlide, selected.key, { fontSize: sz })}>
                    {sz}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">颜色</Label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={currentTextOv?.color ?? selected.initialColor ?? "#000000"}
                  onChange={(e) => updateText(currentSlide, selected.key, { color: e.target.value })}
                  className="h-9 w-12 rounded border cursor-pointer"
                />
                <Input
                  value={currentTextOv?.color ?? ""}
                  placeholder={selected.initialColor}
                  onChange={(e) => updateText(currentSlide, selected.key, { color: e.target.value })}
                />
                <Button variant="outline" size="sm"
                  onClick={() => updateText(currentSlide, selected.key, { color: undefined })}
                  title="恢复默认">
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full"
              onClick={() => updateText(currentSlide, selected.key, { text: undefined, fontSize: undefined, color: undefined })}>
              <RotateCcw className="w-3 h-3 mr-2" /> 重置此处文字
            </Button>
          </div>
        )}

        {selected.kind === "image" && (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <ImageIcon className="w-3 h-3" /> 已选中图片
            </div>
            {selected.imageSrc && (
              <img src={selected.imageSrc} alt="预览" className="w-full h-32 object-cover rounded border" />
            )}
            <div className="space-y-1.5">
              <Label className="text-xs">图片 URL</Label>
              <Input
                placeholder="https://... 或 留空恢复"
                value={slideOv.images[selected.key]?.src?.startsWith("data:") ? "" : (slideOv.images[selected.key]?.src ?? "")}
                onChange={(e) => {
                  updateImage(currentSlide, selected.key, { src: e.target.value });
                  setSelected((s) => ({ ...s, imageSrc: e.target.value }));
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">或上传本地图片</Label>
              <input
                ref={fileInputRef} type="file" accept="image/*" hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImageFile(f);
                  e.target.value = "";
                }}
              />
              <Button variant="outline" size="sm" className="w-full" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-3 h-3 mr-2" /> 选择图片
              </Button>
            </div>
            <Button variant="outline" size="sm" className="w-full"
              onClick={() => {
                updateImage(currentSlide, selected.key, { src: "" });
                setSelected((s) => ({ ...s, imageSrc: undefined }));
              }}>
              <RotateCcw className="w-3 h-3 mr-2" /> 恢复原图
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}

function rgbToHex(rgb: string): string {
  const m = rgb.match(/\d+/g);
  if (!m || m.length < 3) return "#000000";
  return "#" + m.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, "0")).join("");
}
