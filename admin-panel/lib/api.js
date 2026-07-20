const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function assertBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not set. Point it to the public-site deployment URL."
    );
  }
}

async function request(path, options = {}) {
  assertBaseUrl();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "X-Admin-Panel": "1",
      ...(options.headers || {})
    }
  });
  return res;
}

export async function fetchContent() {
  const res = await request("/api/content", { method: "GET" });
  if (!res.ok) throw new Error("Не вдалося завантажити вміст сайту.");
  const data = await res.json();
  return data.content;
}

export async function checkSession() {
  try {
    const res = await request("/api/admin/me", { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function login(password) {
  const res = await request("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Помилка входу.");
  return true;
}

export async function logout() {
  await request("/api/admin/logout", { method: "POST" });
}

export async function saveContent(content) {
  const res = await request("/api/admin/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Не вдалося зберегти зміни.");
  return true;
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await request("/api/admin/upload", {
    method: "POST",
    body: formData
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Не вдалося завантажити файл.");
  return data.url;
}
