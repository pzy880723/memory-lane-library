import { describe, expect, it } from "vitest";
import { makeNodeKey, findEditableImages } from "./nodeKey";

describe("editable store images", () => {
  it("keeps a saved photo replacement attached when its caption or layout changes", () => {
    const root = document.createElement("div");
    root.innerHTML = '<figure><img data-edit-id="store-wenzhou-exterior" alt="温州店门头"><figcaption>门店实景</figcaption></figure>';
    const image = root.querySelector("img")!;
    const before = makeNodeKey(root, image, "image");
    root.prepend(document.createElement("h1"));
    image.alt = "温州朔门古港店外观";
    expect(makeNodeKey(root, image, "image")).toBe(before);
    expect(findEditableImages(root)).toContain(image);
  });

  it("preserves legacy keys for the existing saved pages", () => {
    const root = document.createElement("div");
    root.innerHTML = '<div><img alt=""></div>';
    expect(makeNodeKey(root, root.querySelector("img")!, "image")).toBe("image:0-0:0");
  });

  it("keeps saved text selected after another edit rerenders the page", () => {
    const root = document.createElement("div");
    root.innerHTML = '<p>门店地址</p>';
    const text = root.querySelector("p")!;
    const original = makeNodeKey(root, text, "text");
    text.dataset.origText = text.textContent!;
    text.textContent = "新地址";
    expect(makeNodeKey(root, text, "text")).toBe(original);
  });
});
