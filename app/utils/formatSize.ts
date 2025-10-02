/**
 * Convert a byte value into a human‑readable string.
 * Supports KB, MB, GB using a 1024 base.
 * Examples:
 *  - formatSize(0) => "0 B"
 *  - formatSize(1536) => "1.5 KB"
 *  - formatSize(1048576) => "1 MB"
 */
export function formatSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "-";
  if (bytes === 0) return "0 B";

  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  const format = (value: number, unit: string) => {
    const rounded = value >= 100 ? Math.round(value) : Math.round(value * 10) / 10;
    return `${rounded} ${unit}`;
  };

  if (bytes >= GB) {
    return format(bytes / GB, "GB");
  }
  if (bytes >= MB) {
    return format(bytes / MB, "MB");
  }
  if (bytes >= KB) {
    return format(bytes / KB, "KB");
  }
  return `${bytes} B`;
}

export const generateUUID = () => crypto.randomUUID();
export default formatSize;
