
export function getExt(name: string): string {
  const idx = name.lastIndexOf('.');
  return idx >= 0 ? name.slice(idx + 1).toLowerCase() : '';
}

export function isAllowedImage(
  file: File,
  allowedMime: Set<string>,
  allowedExt: Set<string>
): boolean {
  const okMime = allowedMime.has(file.type);
  const ext = getExt(file.name);
  const okExt = allowedExt.has(ext);
  return okMime && okExt;
}

export async function getImageSize(file: File): Promise<{ width: number; height: number }> {
  try {
    const bmp = await createImageBitmap(file);
    const size = { width: bmp.width, height: bmp.height };
    bmp.close?.();
    return size;
  } catch {
    const url = URL.createObjectURL(file);
    try {
      return await new Promise<{ width: number; height: number }>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => reject(new Error('decode_error'));
        img.src = url;
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}
