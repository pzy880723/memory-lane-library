import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EditorProvider, useEditor } from "./EditorContext";
import { loadOverridesRemote, saveOverridesRemote } from "./storage";

vi.mock("@/lib/export", () => ({ precacheAll: vi.fn() }));
vi.mock("@/lib/bookApi", () => ({ editorSession: vi.fn().mockResolvedValue(false), editorLogin: vi.fn().mockResolvedValue(undefined), editorLogout: vi.fn().mockResolvedValue(undefined) }));
vi.mock("./storage", async (original) => {
  const actual = await original<typeof import("./storage")>();
  return { ...actual, loadOverridesRemote: vi.fn(), saveOverridesRemote: vi.fn() };
});

const empty = { version: 1 as const, updatedAt: "2026-11-02", slides: {} };

describe("image replacement cloud save", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.mocked(loadOverridesRemote).mockResolvedValue(structuredClone(empty));
    vi.mocked(saveOverridesRemote).mockReset().mockResolvedValue();
  });
  afterEach(cleanup);

  it("keeps a replacement after the editor is remounted from its saved cloud data", async () => {
    const saved = renderHook(useEditor, { wrapper: EditorProvider });
    await waitFor(() => expect(saved.result.current.loaded).toBe(true));
    act(() => saved.result.current.updateImage(37, "image:id:store-wenzhou-exterior", { src: "https://example.com/replaced.jpg" }));
    await waitFor(() => expect(saveOverridesRemote).toHaveBeenCalled(), { timeout: 2000 });
    const cloudData = vi.mocked(saveOverridesRemote).mock.calls.at(-1)![0];
    saved.unmount();
    localStorage.clear();
    vi.mocked(loadOverridesRemote).mockResolvedValue(cloudData);
    const refreshed = renderHook(useEditor, { wrapper: EditorProvider });
    await waitFor(() => expect(refreshed.result.current.loaded).toBe(true));
    expect(refreshed.result.current.data.slides[37].images["image:id:store-wenzhou-exterior"].src).toBe("https://example.com/replaced.jpg");
  });

  it("reports a cloud save failure and lets the owner retry the same replacement", async () => {
    vi.mocked(saveOverridesRemote).mockRejectedValueOnce(new Error("offline"));
    const editor = renderHook(useEditor, { wrapper: EditorProvider });
    await waitFor(() => expect(editor.result.current.loaded).toBe(true));
    act(() => editor.result.current.updateImage(37, "image:id:store-wenzhou-exterior", { src: "https://example.com/replaced.jpg" }));
    await waitFor(() => expect(editor.result.current.saveError).toBeTruthy(), { timeout: 2000 });
    expect(editor.result.current.saving).toBe(false);
    act(() => editor.result.current.retrySave());
    await waitFor(() => expect(saveOverridesRemote).toHaveBeenCalledTimes(2), { timeout: 2000 });
    await waitFor(() => expect(editor.result.current.saveError).toBeNull());
  });
});
