// Only the exact admin panel origin (set via env var) may call the
// authenticated /api/admin/* endpoints with credentials. This is checked
// both for CORS purposes and as an explicit server-side guard, since CORS
// headers alone only stop browsers from reading the response, not from
// sending the request.
function allowedAdminOrigin() {
  return process.env.ADMIN_ORIGIN || "";
}

export function isAllowedAdminOrigin(origin) {
  const allowed = allowedAdminOrigin();
  return Boolean(origin) && Boolean(allowed) && origin === allowed;
}

export function corsHeaders(origin) {
  const headers = {
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,X-Admin-Panel",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin"
  };
  if (isAllowedAdminOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

export function handlePreflight(request) {
  const origin = request.headers.get("origin") || "";
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}
