export const GATEWAY_BASE_URL_ENV = "NAUTILO_GATEWAY_BASE_URL";

/**
 * The OpenAI-compatible gateway base URL the runtime sends requests to: a
 * trimmed http(s) URL without trailing slashes.
 */
export function normalizeGatewayBaseUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const baseUrl = value.trim();
  if (baseUrl.length === 0) return undefined;
  try {
    const url = new URL(baseUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return baseUrl.replace(/\/+$/, "");
  } catch {
    return undefined;
  }
}

/**
 * The destination a gateway bearer key may be checked against or bound to:
 * the normalized base URL, refused when it embeds credentials, a query, or a
 * fragment, so a key is only ever sent to a plain base path. A bare `?` or
 * `#` is refused as well: the URL parser reports it as an empty query or
 * fragment, yet a path appended to such a base would land behind the
 * delimiter and the request would go to the base path itself.
 */
export function gatewayKeyDestination(value: unknown): string | null {
  const normalized = normalizeGatewayBaseUrl(value);
  if (!normalized) return null;
  if (/[?#]/.test(normalized)) return null;
  const url = new URL(normalized);
  if (url.username || url.password) return null;
  return normalized;
}
