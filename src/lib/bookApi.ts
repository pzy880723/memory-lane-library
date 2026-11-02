let revision: string | null = null;

export async function bookRequest(path: string, init: RequestInit = {}) {
  const response = await fetch(`/api/book${path}`, { credentials: "same-origin", cache: "no-store", ...init });
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.error ?? `请求失败 (${response.status})`);
  }
  return response;
}

export async function readContent() {
  const version = window.location.pathname.startsWith("/print/") ? new URLSearchParams(window.location.search).get("v") : null;
  const result = await (await bookRequest(`/content${version ? `?version=${encodeURIComponent(version)}` : ""}`)).json();
  revision = result.revision;
  return result.data;
}

export async function writeContent(data: unknown) {
  if (!revision) throw new Error("请先读取服务器内容，再保存修改");
  const result = await (await bookRequest("/content", { method: "PUT", headers: { "Content-Type": "application/json", "If-Match": revision }, body: JSON.stringify(data) })).json();
  revision = result.revision;
}

export async function editorLogin(password: string) {
  await bookRequest("/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
}

export async function editorSession() {
  const result = await fetch("/api/book/session", { credentials: "same-origin", cache: "no-store" });
  return result.ok;
}

export async function editorLogout() {
  await bookRequest("/logout", { method: "POST" });
}
