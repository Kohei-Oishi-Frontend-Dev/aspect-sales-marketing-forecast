const baseURL = process.env.API_BASE_URL;

export async function postJson<T = unknown>(path: string, body: unknown): Promise<T> {
  if (!baseURL) {
    throw new Error(
      "API_BASE_URL is not configured. Set API_BASE_URL in environment before calling external analytics endpoints."
    );
  }
  const url = new URL(path, baseURL).toString();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`POST ${path} failed ${res.status}: ${txt}`);
  }
  return (await res.json()) as T;
}

export async function getJson<T = unknown>(path: string): Promise<T> {
  if (!baseURL) {
    throw new Error(
      "API_BASE_URL is not configured. Set API_BASE_URL in environment before calling external analytics endpoints."
    );
  }
  const url = new URL(path, baseURL).toString();
  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`GET ${path} failed ${res.status}: ${txt}`);
  }
  return (await res.json()) as T;
}