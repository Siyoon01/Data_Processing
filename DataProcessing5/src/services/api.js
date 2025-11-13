export async function getJson(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${url} ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}
