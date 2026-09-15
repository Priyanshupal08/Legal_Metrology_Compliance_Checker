/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Creates an Excel-compatible CSV string with UTF-8 Byte Order Mark (BOM)
 * and CRLF line breaks so Microsoft Excel and Google Sheets open all
 * Indian Rupee symbols (₹), text, and special characters cleanly.
 */
export function createExcelFormattedCsv(headers: string[], rows: (string | number | undefined | null)[][]): string {
  const BOM = '\uFEFF';
  const sanitize = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerLine = headers.map(sanitize).join(',');
  const rowLines = rows.map((r) => r.map(sanitize).join(','));
  return BOM + [headerLine, ...rowLines].join('\r\n');
}

/**
 * Cross-platform file exporter and native share handler
 * Works reliably in:
 * - Android APK / Capacitor WebViews (via Web Share API with files)
 * - Desktop Chrome / Edge / Firefox
 * - Mobile Safari / iOS
 */
export async function exportOrShareFile(options: {
  filename: string;
  content: string | Blob;
  mimeType: string;
  title?: string;
}): Promise<{ success: boolean; method: 'share' | 'download' | 'copy' }> {
  const { filename, content, mimeType, title } = options;

  let blob: Blob;
  if (typeof content === 'string') {
    blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  } else {
    blob = content;
  }

  // 1. First priority for mobile & APK: Web Share API with File payload
  if (typeof navigator !== 'undefined' && navigator.canShare && typeof File !== 'undefined') {
    try {
      const file = new File([blob], filename, { type: mimeType });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: title || filename,
          files: [file],
        });
        return { success: true, method: 'share' };
      }
    } catch (err: any) {
      // If user simply closed the system share sheet, consider it handled
      if (err?.name === 'AbortError') {
        return { success: true, method: 'share' };
      }
      console.warn('Native navigator.share failed, falling back to download:', err);
    }
  }

  // 2. Standard browser download link
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch {}
    }, 500);
    return { success: true, method: 'download' };
  } catch (err) {
    console.warn('Direct blob URL download failed:', err);
  }

  // 3. Fallback: Data URI download
  try {
    if (typeof content === 'string') {
      const encoded = encodeURIComponent(content);
      const dataUri = `data:${mimeType};charset=utf-8,${encoded}`;
      const link = document.createElement('a');
      link.href = dataUri;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        try {
          document.body.removeChild(link);
        } catch {}
      }, 500);
      return { success: true, method: 'download' };
    }
  } catch (err) {
    console.warn('Data URI fallback failed:', err);
  }

  return { success: false, method: 'download' };
}

/**
 * Shares or downloads an image from a Data URL (e.g. from html2canvas PNG output)
 */
export async function exportOrShareImage(
  filename: string,
  dataUrl: string,
  title?: string
): Promise<{ success: boolean; method: 'share' | 'download' }> {
  try {
    // Convert base64 dataUrl to Blob
    const res = await fetch(dataUrl);
    const blob = await res.blob();

    // 1. Try mobile / APK native share sheet
    if (typeof navigator !== 'undefined' && navigator.canShare && typeof File !== 'undefined') {
      try {
        const file = new File([blob], filename, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: title || 'LMPC Packaging Inspection Report',
            text: 'Statutory Verification & Legal Metrology Inspection Record',
            files: [file],
          });
          return { success: true, method: 'share' };
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          return { success: true, method: 'share' };
        }
        console.warn('Native image share failed, falling back to download:', err);
      }
    }

    // 2. Direct browser download
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        document.body.removeChild(link);
      } catch {}
    }, 500);
    return { success: true, method: 'download' };
  } catch (err) {
    console.error('Failed to export or share image:', err);
    return { success: false, method: 'download' };
  }
}

export function downloadCsv(filename: string, csvContent: string) {
  try {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch {}
    }, 1000);
  } catch (err) {
    console.warn('Blob URL download failed, falling back to data URI:', err);
    try {
      const encoded = encodeURIComponent(csvContent);
      const dataUri = `data:text/csv;charset=utf-8,${encoded}`;
      const link = document.createElement('a');
      link.href = dataUri;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        try {
          document.body.removeChild(link);
        } catch {}
      }, 1000);
    } catch (e) {
      console.error('Direct CSV download failed:', e);
    }
  }
}

export function downloadJson(filename: string, jsonString: string) {
  exportOrShareFile({
    filename,
    content: jsonString,
    mimeType: 'application/json',
    title: 'LMPC Inspection JSON Data',
  });
}
