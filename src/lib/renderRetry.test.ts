import { describe, expect, it, vi } from "vitest";
import { renderWithRetry } from "./renderRetry";

describe("slide render retries", () => {
  it("reports one retry and returns the successful second screenshot", async () => {
    const render = vi.fn().mockRejectedValueOnce(new Error("502")).mockResolvedValueOnce("jpeg");
    const progress = vi.fn();
    await expect(renderWithRetry(render, progress, async () => {})).resolves.toBe("jpeg");
    expect(progress).toHaveBeenCalledWith(1, 1);
    expect(render).toHaveBeenCalledTimes(2);
  });
  it("includes the retry count in terminal failures without further attempts", async () => {
    const render = vi.fn().mockRejectedValue(new Error("第 3 页截图失败 (502)"));
    await expect(renderWithRetry(render, vi.fn(), async () => {})).rejects.toThrow("自动重试 1/1 次后仍失败");
    expect(render).toHaveBeenCalledTimes(2);
  });
  it("does not report retries for a successful first screenshot", async () => {
    const progress = vi.fn();
    await renderWithRetry(async () => "jpeg", progress);
    expect(progress).not.toHaveBeenCalled();
  });
});