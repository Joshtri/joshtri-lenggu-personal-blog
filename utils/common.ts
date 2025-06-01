import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export function formatDate(date: Date | string, withTime = false): string {
    const parsed = typeof date === 'string' ? new Date(date) : date;
    return format(parsed, withTime ? 'dd MMMM yyyy HH:mm' : 'dd MMMM yyyy', { locale: id });
}


export function truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}


export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
}


export function isEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.toLowerCase());
}


export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
}


export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((result, item) => {
        const groupKey = item[key] as string;
        result[groupKey] = result[groupKey] || [];
        result[groupKey].push(item);
        return result;
    }, {} as Record<string, T[]>);
}


export function parseUserAgent(agent: string | undefined): string {
    if (!agent) return 'Unknown';
    if (agent.includes('Chrome')) return 'Chrome';
    if (agent.includes('Firefox')) return 'Firefox';
    if (agent.includes('Safari') && !agent.includes('Chrome')) return 'Safari';
    if (agent.includes('Edge')) return 'Edge';
    return 'Other';
}


export function formatRupiah(value: string): string {
    const numberString = value.replace(/[^,\d]/g, "").toString();
    const split = numberString.split(",");
    const sisa = split[0].length % 3;
    const rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/g);

    let formatted = rupiah;
    if (ribuan) {
        const separator = sisa ? "." : "";
        formatted += separator + ribuan.join(".");
    }

    return split[1] !== undefined ? `${formatted},${split[1]}` : formatted;
}



/**
 * Format tanggal ke dalam format Bahasa Indonesia
 * Contoh output: 31 Mei 2025
 */
export function formatIndonesianDate(date: Date | string): string {
  try {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return format(parsedDate, "d MMMM yyyy", { locale: id });
  } catch (error) {
    console.error("Invalid date format:", error);
    return "";
  }
}

/**
 * Menghitung estimasi waktu baca dari konten HTML.
 * @param htmlContent Konten dalam format HTML (string)
 * @param wordsPerMinute Jumlah kata per menit (standar: 200 wpm)
 * @returns Contoh output: "4 min read"
 */
export function calculateReadTime(htmlContent: string, wordsPerMinute = 200): string {
  if (!htmlContent) return "0 min read";

  // Hapus semua tag HTML
  const textOnly = htmlContent.replace(/<[^>]+>/g, " ");
  const wordCount = textOnly.trim().split(/\s+/).length;

  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}
