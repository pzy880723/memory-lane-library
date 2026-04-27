import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pencil, Download, Upload, RotateCcw, LogOut, X, Image as ImageIcon, Type,
} from "lucide-react";
import { useEditor } from "@/lib/editor/EditorContext";
import { exportJSON, importJSON } from "@/lib/editor/storage";
import { toast } from "@/hooks/use-toast";

interface Selected {
  kind: "text" | "image" | null;
  key: string;
  // 文字相关初始值（来自 DOM 计算样式）
  initialFontSize?: string;
  initialColor?: string;
  // 图片相关
  imageSrc?: string;
}

export function EditorPanel() {
  const {
    editing, toggleEditing, lock, data, currentSlide,
    updateText, updateImage, resetAll, reload,
  } = useEditor();

  const [selected, setSelected] = useState<Selected>({ kind: null, key: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importJsonRef = useRef<HTMLInputElement>(null);

  // 暴露给外部 (slide stage) 的两个回调
  useEffect(() => {
    (window as unknown as { __editorSelectImage?: (k: string, src: string) => void }).__editorSelectImage =
      (key, src) => setSelected({ kind: "image", key, imageSrc: src });
    (window as unknown as { __editorSelectText?: (k: string, el: HTMLElement) => void }).__editorSelectText =
      (key, el) => {
        const cs = window.getComputedStyle(el);
        setSelected({
          kind: "text", key,
          initialFontSize: cs.fontSize,
          initialColor: rgbToHex(cs.color),
        });
      };
    return () => {
      const w = window as unknown as Record<string, unknown>;
      delete w.__editorSelectImage;
      delete w.__editorSelectText;
    };
  }, []);

  // 切换 slide 时清空选中
  useEffect(() => { setSelected({ kind: null, key: "" }); }, [currentSlide]);

  if (!editing) return null;

  const slideOv = data.slides[currentSlide] ?? { texts: {}, images: {} };
  const currentTextOv = selected.kind === "text" ? slideOv.texts[selected.key] : undefined;

  const handleImageFile = (file: File) => {
    if (file.size > 4 * 1024 * 1024) {
      toast({ title: "图片过大", description: "建议小于 4MB，否则浏览器存储会满", variant: "destructive" });
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateImage(currentSlide, selected.key, { src: reader.result as string });
      setSelected((s) => ({ ...s, imageSrc: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <aside className="fixed right-4 top-20 bottom-4 w-80 z-[60] bg-background border-2 border-primary/30 rounded-lg shadow-2xl flex flex-col text-foreground">
      <header className="flex items-center justify-between px-4 py-3 border-b bg-primary/5">
        <div className="flex items-center gap-2">
          <Pencil className="w-4 h-4 text-primary" />
          <span className="font-bold text-sm">编辑模式 · 第 {currentSlide + 1} 页</span>
        </div>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={toggleEditing} aria-label="收起">
          <X className="w-4 h-4" />
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selected.kind === null && (
          <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
            <p className="font-medium text-foreground">使用说明：</p>
            <ul className="space-y-2 list-disc pl-5">
              <li>点击页面上任意<strong>文字</strong>即可直接修改</li>
              <li>点击任意<strong>图片</strong>可替换（URL 或上传）</li>
              <li>修改自动保存到本地</li>
              <li>右下方可导出 JSON 备份/同步</li>
            </ul>
          </div>
        )}

        {selected.kind === "text" && (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground">已选中文字 · 在页面上直接编辑内容</div>

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

      <footer className="border-t p-3 space-y-2 bg-muted/30">
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
            <RotateCcw className="w-3 h-3 mr-1" /> 重置
          </Button>
          <Button size="sm" variant="outline" onClick={lock}>
            <LogOut className="w-3 h-3 mr-1" /> 退出
          </Button>
        </div>
      </footer>
    </aside>
  );
}

function rgbToHex(rgb: string): string {
  const m = rgb.match(/\d+/g);
  if (!m || m.length < 3) return "#000000";
  return "#" + m.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, "0")).join("");
}
