
export function normalizeAvatarPath(input: string): string {
  if (!input) return '';
  try {
    const url = new URL(input);
    input = url.pathname; // ej: /avatars/6.png
  } catch { /* relativa */ }
  let path = input.startsWith('/') ? input : `/${input}`;
  return path.replace(/\/{2,}/g, '/');
}
