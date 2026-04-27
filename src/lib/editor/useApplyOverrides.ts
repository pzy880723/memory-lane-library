import { useEffect, useRef } from "react";
import { useEditor } from "./EditorContext";
import {
  findEditableImages, findEditableTextNodes, makeNodeKey,
} from "./nodeKey";

/**
 * 在 slide 容器上：
 * 1. 应用已保存的 overrides（替换文字/图片/字号/颜色）
 * 2. 编辑模式下，给文字节点加 contenteditable，监听变更
 * 3. 编辑模式下，给图片绑定点击 → 触发外部 onPickImage
 */
export interface OverlayApi {
  containerRef: React.RefObject<HTMLDivElement>;
  pickedImageKeyRef: React.MutableRefObject<string | null>;
}

export function useApplyOverrides(
  slideIndex: number,
  containerRef: React.RefObject<HTMLDivElement>,
  onSelectImage: (key: string, currentSrc: string) => void,
  onSelectText: (key: string, el: HTMLElement) => void,
  containerEl?: HTMLElement | null,
) {
  const { data, editing, updateText } = useEditor();
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const overrides = dataRef.current.slides[slideIndex] ?? { texts: {}, images: {} };

    // ===== 应用文字 overrides =====
    const textNodes = findEditableTextNodes(root);
    const textCleanup: Array<() => void> = [];

    textNodes.forEach((el) => {
      const key = makeNodeKey(root, el, "text");
      const ov = overrides.texts[key];
      // 保存原始内容（仅一次）便于撤销
      if (!el.dataset.origText) {
        el.dataset.origText = el.textContent ?? "";
      }
      if (ov?.text != null) el.textContent = ov.text;
      else el.textContent = el.dataset.origText;

      if (ov?.fontSize) el.style.fontSize = ov.fontSize;
      else el.style.removeProperty("font-size");

      if (ov?.color) el.style.color = ov.color;
      else el.style.removeProperty("color");

      el.dataset.editKey = key;

      if (editing) {
        el.setAttribute("contenteditable", "true");
        el.style.outline = "1px dashed hsl(var(--primary) / 0.45)";
        el.style.outlineOffset = "2px";
        el.style.cursor = "text";

        const handleInput = () => {
          updateText(slideIndex, key, { text: el.textContent ?? "" });
        };
        const handleFocus = () => {
          onSelectText(key, el);
          el.style.outline = "2px solid hsl(var(--primary))";
        };
        const handleBlur = () => {
          el.style.outline = "1px dashed hsl(var(--primary) / 0.45)";
        };
        el.addEventListener("input", handleInput);
        el.addEventListener("focus", handleFocus);
        el.addEventListener("blur", handleBlur);
        textCleanup.push(() => {
          el.removeEventListener("input", handleInput);
          el.removeEventListener("focus", handleFocus);
          el.removeEventListener("blur", handleBlur);
          el.removeAttribute("contenteditable");
          el.style.outline = "";
          el.style.outlineOffset = "";
          el.style.cursor = "";
        });
      }
    });

    // ===== 应用图片 overrides =====
    const imgs = findEditableImages(root);
    const imgCleanup: Array<() => void> = [];
    imgs.forEach((img) => {
      const key = makeNodeKey(root, img, "image");
      const ov = overrides.images[key];
      if (!img.dataset.origSrc) img.dataset.origSrc = img.src;
      if (ov?.src) img.src = ov.src;
      else img.src = img.dataset.origSrc;
      img.dataset.editKey = key;

      if (editing) {
        img.style.outline = "2px dashed hsl(var(--primary) / 0.6)";
        img.style.cursor = "pointer";
        const handleClick = (e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          onSelectImage(key, img.src);
        };
        img.addEventListener("click", handleClick);
        imgCleanup.push(() => {
          img.removeEventListener("click", handleClick);
          img.style.outline = "";
          img.style.cursor = "";
        });
      }
    });

    return () => {
      textCleanup.forEach((fn) => fn());
      imgCleanup.forEach((fn) => fn());
    };
  }, [slideIndex, editing, data, containerRef, onSelectImage, onSelectText, updateText, containerEl]);
}
