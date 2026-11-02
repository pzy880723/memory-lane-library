export async function renderWithRetry<T>(
  render: () => Promise<T>,
  onRetry: (retryCount: number, maxRetries: number) => void,
  wait: () => Promise<void> = () => new Promise((resolve) => setTimeout(resolve, 2000)),
): Promise<T> {
  try {
    return await render();
  } catch {
    onRetry(1, 1);
    await wait();
    try {
      return await render();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`${message}（自动重试 1/1 次后仍失败）`);
    }
  }
}