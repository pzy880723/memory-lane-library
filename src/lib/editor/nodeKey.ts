/**
 * 为 DOM 元素生成稳定 key —— 基于在 slide 容器内的路径 + 标签 + 原始文字前 12 字符
 * 同一个元素跨次渲染应得到相同 key（只要 DOM 结构没变）
 */

export function makeNodeKey(root: HTMLElement, node: HTMLElement, kind: "text" | "image"): string {
  const path: number[] = [];
  let cur: HTMLElement | null = node;
  while (cur && cur !== root) {
    const parent: HTMLElement | null = cur.parentElement;
    if (!parent) break;
    const idx = Array.from(parent.children).indexOf(cur);
    path.unshift(idx);
    cur = parent;
  }
  const seed =
    kind === "text"
      ? (node.textContent ?? "").trim().slice(0, 12)
      : (node as HTMLImageElement).getAttribute("alt") ?? "";
  return `${kind}:${path.join("-")}:${hashStr(seed)}`;
}

function hashStr(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(36);
}

/**
 * 找出 root 内所有「叶子文本节点」对应的元素 —— 即包含可见文字、且没有可编辑子元素的元素
 */
export function findEditableTextNodes(root: HTMLElement): HTMLElement[] {
  const result: HTMLElement[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (n) => {
      const el = n as HTMLElement;
      // 跳过自身或父级标记 no-edit
      if (el.closest("[data-no-edit]")) return NodeFilter.FILTER_REJECT;
      // 跳过 svg / icon
      if (el.tagName === "SVG" || el.closest("svg")) return NodeFilter.FILTER_REJECT;
      // 必须直接包含文本子节点
      const hasDirectText = Array.from(el.childNodes).some(
        (c) => c.nodeType === Node.TEXT_NODE && (c.textContent ?? "").trim().length > 0,
      );
      // 不能再有元素子节点（叶子）
      const hasElementChild = Array.from(el.children).length > 0;
      if (hasDirectText && !hasElementChild) return NodeFilter.FILTER_ACCEPT;
      return NodeFilter.FILTER_SKIP;
    },
  });
  let cur = walker.nextNode();
  while (cur) {
    result.push(cur as HTMLElement);
    cur = walker.nextNode();
  }
  return result;
}

export function findEditableImages(root: HTMLElement): HTMLImageElement[] {
  return Array.from(root.querySelectorAll("img")).filter(
    (img) => !img.closest("[data-no-edit]"),
  );
}
