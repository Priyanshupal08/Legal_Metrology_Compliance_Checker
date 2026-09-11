/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Safely extracts and sanitizes SVG markup from a data URI or raw string
 * without throwing URIError on unencoded '%' signs (e.g. 0%, 100%).
 */
export function safeExtractSvg(rawSvgOrDataUri: string): string {
  if (!rawSvgOrDataUri) return '';

  // Case 1: Base64 data URI
  if (rawSvgOrDataUri.startsWith('data:image/svg+xml;base64,')) {
    try {
      const base64Data = rawSvgOrDataUri.replace('data:image/svg+xml;base64,', '');
      return atob(base64Data);
    } catch {
      return '';
    }
  }

  // Strip prefix if utf8 or generic data URI
  let content = rawSvgOrDataUri.replace(/^data:image\/svg\+xml(;utf8)?,/i, '');

  // Case 2: If fully percent-encoded (starts with %3Csvg)
  if (content.trim().startsWith('%3C') || content.trim().startsWith('%3c')) {
    try {
      return decodeURIComponent(content);
    } catch {
      // If decodeURIComponent fails, do a safe regex replacement
      return content
        .replace(/%3C/gi, '<')
        .replace(/%3E/gi, '>')
        .replace(/%20/g, ' ')
        .replace(/%22/g, '"')
        .replace(/%23/g, '#');
    }
  }

  // Case 3: Raw SVG string with %23 for hex color codes
  // We MUST NOT call decodeURIComponent here because SVG attributes like x1="0%" or offset="100%"
  // have legitimate % signs that cause decodeURIComponent to throw "URIError: URI malformed".
  return content.replace(/%23/g, '#');
}
