
export function truncate(text: string, max: number, fullVisible: boolean) {
  if (!text) return { text: '', truncated: false };
  if (fullVisible || text.length <= max) return { text, truncated: false };
  return { text: text.slice(0, max), truncated: true };
}

/** Sanitizador básico del lado cliente.
 *  ⚠️ No sustituye sanitización en servidor.
 */
export function sanitizeDescription(
  input: string,
  maxLen: number
): string {
  const val = input ?? '';
  let out = val.replace(/<\s*script\b[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '');
  out = out.replace(/\s+on[a-z]+\s*=\s*(['"]).*?\1/gi, '');
  out = out.replace(/\bjavascript\s*:\s*/gi, '');
  out = out.replace(/<[^>]*>/g, '');
  out = out.replace(/[\u0000-\u001F\u007F]/g, '');
  if (out.length > maxLen) out = out.slice(0, maxLen);
  return out;
}
