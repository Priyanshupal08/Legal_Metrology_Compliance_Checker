/**
 * GS1 Barcode (EAN-13, UPC-A, EAN-8) Validation and Provenance Cross-Verification Engine
 * Under Legal Metrology (Packaged Commodities) Rules, 2011 & Legal Metrology Act, 2009
 */

import { BarcodeVerificationResult } from '../types/compliance';

// Lazy loader for @zxing/library to support both ESM Vite bundling and Node server
let zxingLibPromise: Promise<any> | null = null;
async function getZXing() {
  if (!zxingLibPromise) {
    zxingLibPromise = import('@zxing/library').then((mod) => (mod as any).default || mod);
  }
  return zxingLibPromise;
}

// Official GS1 Country Prefix Table
export const GS1_PREFIX_TABLE: { rangeStart: number; rangeEnd: number; country: string; region: string }[] = [
  { rangeStart: 0, rangeEnd: 19, country: 'United States & Canada', region: 'North America' },
  { rangeStart: 20, rangeEnd: 29, country: 'Restricted Distribution (Internal/Store Use)', region: 'Global' },
  { rangeStart: 30, rangeEnd: 39, country: 'United States (National Drug Code)', region: 'North America' },
  { rangeStart: 40, rangeEnd: 49, country: 'Restricted Distribution', region: 'Global' },
  { rangeStart: 50, rangeEnd: 59, country: 'Coupons', region: 'Global' },
  { rangeStart: 60, rangeEnd: 139, country: 'United States & Canada', region: 'North America' },
  { rangeStart: 200, rangeEnd: 299, country: 'Restricted Distribution / In-store', region: 'Global' },
  { rangeStart: 300, rangeEnd: 379, country: 'France & Monaco', region: 'Europe' },
  { rangeStart: 380, rangeEnd: 380, country: 'Bulgaria', region: 'Europe' },
  { rangeStart: 383, rangeEnd: 383, country: 'Slovenia', region: 'Europe' },
  { rangeStart: 385, rangeEnd: 385, country: 'Croatia', region: 'Europe' },
  { rangeStart: 387, rangeEnd: 387, country: 'Bosnia and Herzegovina', region: 'Europe' },
  { rangeStart: 389, rangeEnd: 389, country: 'Montenegro', region: 'Europe' },
  { rangeStart: 400, rangeEnd: 440, country: 'Germany', region: 'Europe' },
  { rangeStart: 450, rangeEnd: 459, country: 'Japan (JAN-13)', region: 'Asia' },
  { rangeStart: 460, rangeEnd: 469, country: 'Russia', region: 'Europe/Asia' },
  { rangeStart: 470, rangeEnd: 470, country: 'Kyrgyzstan', region: 'Asia' },
  { rangeStart: 471, rangeEnd: 471, country: 'Taiwan', region: 'Asia' },
  { rangeStart: 474, rangeEnd: 474, country: 'Estonia', region: 'Europe' },
  { rangeStart: 475, rangeEnd: 475, country: 'Latvia', region: 'Europe' },
  { rangeStart: 476, rangeEnd: 476, country: 'Azerbaijan', region: 'Asia' },
  { rangeStart: 477, rangeEnd: 477, country: 'Lithuania', region: 'Europe' },
  { rangeStart: 478, rangeEnd: 478, country: 'Uzbekistan', region: 'Asia' },
  { rangeStart: 479, rangeEnd: 479, country: 'Sri Lanka', region: 'South Asia' },
  { rangeStart: 480, rangeEnd: 480, country: 'Philippines', region: 'Southeast Asia' },
  { rangeStart: 481, rangeEnd: 481, country: 'Belarus', region: 'Europe' },
  { rangeStart: 482, rangeEnd: 482, country: 'Ukraine', region: 'Europe' },
  { rangeStart: 484, rangeEnd: 484, country: 'Moldova', region: 'Europe' },
  { rangeStart: 485, rangeEnd: 485, country: 'Armenia', region: 'Asia' },
  { rangeStart: 486, rangeEnd: 486, country: 'Georgia', region: 'Asia' },
  { rangeStart: 487, rangeEnd: 487, country: 'Kazakhstan', region: 'Asia' },
  { rangeStart: 488, rangeEnd: 488, country: 'Tajikistan', region: 'Asia' },
  { rangeStart: 489, rangeEnd: 489, country: 'Hong Kong', region: 'East Asia' },
  { rangeStart: 490, rangeEnd: 499, country: 'Japan (JAN-13)', region: 'Asia' },
  { rangeStart: 500, rangeEnd: 509, country: 'United Kingdom', region: 'Europe' },
  { rangeStart: 520, rangeEnd: 521, country: 'Greece', region: 'Europe' },
  { rangeStart: 528, rangeEnd: 528, country: 'Lebanon', region: 'Middle East' },
  { rangeStart: 529, rangeEnd: 529, country: 'Cyprus', region: 'Europe' },
  { rangeStart: 530, rangeEnd: 530, country: 'Albania', region: 'Europe' },
  { rangeStart: 531, rangeEnd: 531, country: 'North Macedonia', region: 'Europe' },
  { rangeStart: 535, rangeEnd: 535, country: 'Malta', region: 'Europe' },
  { rangeStart: 539, rangeEnd: 539, country: 'Ireland', region: 'Europe' },
  { rangeStart: 540, rangeEnd: 549, country: 'Belgium & Luxembourg', region: 'Europe' },
  { rangeStart: 560, rangeEnd: 560, country: 'Portugal', region: 'Europe' },
  { rangeStart: 569, rangeEnd: 569, country: 'Iceland', region: 'Europe' },
  { rangeStart: 570, rangeEnd: 579, country: 'Denmark, Faroe Islands, Greenland', region: 'Europe' },
  { rangeStart: 590, rangeEnd: 590, country: 'Poland', region: 'Europe' },
  { rangeStart: 594, rangeEnd: 594, country: 'Romania', region: 'Europe' },
  { rangeStart: 599, rangeEnd: 599, country: 'Hungary', region: 'Europe' },
  { rangeStart: 600, rangeEnd: 601, country: 'South Africa', region: 'Africa' },
  { rangeStart: 603, rangeEnd: 603, country: 'Ghana', region: 'Africa' },
  { rangeStart: 604, rangeEnd: 604, country: 'Senegal', region: 'Africa' },
  { rangeStart: 608, rangeEnd: 608, country: 'Bahrain', region: 'Middle East' },
  { rangeStart: 609, rangeEnd: 609, country: 'Mauritius', region: 'Africa' },
  { rangeStart: 611, rangeEnd: 611, country: 'Morocco', region: 'Africa' },
  { rangeStart: 613, rangeEnd: 613, country: 'Algeria', region: 'Africa' },
  { rangeStart: 615, rangeEnd: 615, country: 'Nigeria', region: 'Africa' },
  { rangeStart: 616, rangeEnd: 616, country: 'Kenya', region: 'Africa' },
  { rangeStart: 618, rangeEnd: 618, country: 'Ivory Coast', region: 'Africa' },
  { rangeStart: 619, rangeEnd: 619, country: 'Tunisia', region: 'Africa' },
  { rangeStart: 620, rangeEnd: 620, country: 'Tanzania', region: 'Africa' },
  { rangeStart: 621, rangeEnd: 621, country: 'Syria', region: 'Middle East' },
  { rangeStart: 622, rangeEnd: 622, country: 'Egypt', region: 'Africa/Middle East' },
  { rangeStart: 624, rangeEnd: 624, country: 'Libya', region: 'Africa' },
  { rangeStart: 625, rangeEnd: 625, country: 'Jordan', region: 'Middle East' },
  { rangeStart: 626, rangeEnd: 626, country: 'Iran', region: 'Middle East' },
  { rangeStart: 627, rangeEnd: 627, country: 'Kuwait', region: 'Middle East' },
  { rangeStart: 628, rangeEnd: 628, country: 'Saudi Arabia', region: 'Middle East' },
  { rangeStart: 629, rangeEnd: 629, country: 'United Arab Emirates (UAE)', region: 'Middle East' },
  { rangeStart: 630, rangeEnd: 630, country: 'Qatar', region: 'Middle East' },
  { rangeStart: 631, rangeEnd: 631, country: 'Namibia', region: 'Africa' },
  { rangeStart: 640, rangeEnd: 649, country: 'Finland', region: 'Europe' },
  { rangeStart: 690, rangeEnd: 699, country: 'China', region: 'East Asia' },
  { rangeStart: 700, rangeEnd: 709, country: 'Norway', region: 'Europe' },
  { rangeStart: 729, rangeEnd: 729, country: 'Israel', region: 'Middle East' },
  { rangeStart: 730, rangeEnd: 739, country: 'Sweden', region: 'Europe' },
  { rangeStart: 740, rangeEnd: 740, country: 'Guatemala', region: 'Central America' },
  { rangeStart: 741, rangeEnd: 741, country: 'El Salvador', region: 'Central America' },
  { rangeStart: 742, rangeEnd: 742, country: 'Honduras', region: 'Central America' },
  { rangeStart: 743, rangeEnd: 743, country: 'Nicaragua', region: 'Central America' },
  { rangeStart: 744, rangeEnd: 744, country: 'Costa Rica', region: 'Central America' },
  { rangeStart: 745, rangeEnd: 745, country: 'Panama', region: 'Central America' },
  { rangeStart: 746, rangeEnd: 746, country: 'Dominican Republic', region: 'Caribbean' },
  { rangeStart: 750, rangeEnd: 750, country: 'Mexico', region: 'North America' },
  { rangeStart: 759, rangeEnd: 759, country: 'Venezuela', region: 'South America' },
  { rangeStart: 760, rangeEnd: 769, country: 'Switzerland & Liechtenstein', region: 'Europe' },
  { rangeStart: 770, rangeEnd: 771, country: 'Colombia', region: 'South America' },
  { rangeStart: 773, rangeEnd: 773, country: 'Uruguay', region: 'South America' },
  { rangeStart: 775, rangeEnd: 775, country: 'Peru', region: 'South America' },
  { rangeStart: 777, rangeEnd: 777, country: 'Bolivia', region: 'South America' },
  { rangeStart: 778, rangeEnd: 779, country: 'Argentina', region: 'South America' },
  { rangeStart: 780, rangeEnd: 780, country: 'Chile', region: 'South America' },
  { rangeStart: 784, rangeEnd: 784, country: 'Paraguay', region: 'South America' },
  { rangeStart: 786, rangeEnd: 786, country: 'Ecuador', region: 'South America' },
  { rangeStart: 789, rangeEnd: 790, country: 'Brazil', region: 'South America' },
  { rangeStart: 800, rangeEnd: 839, country: 'Italy, San Marino, Vatican City', region: 'Europe' },
  { rangeStart: 840, rangeEnd: 849, country: 'Spain & Andorra', region: 'Europe' },
  { rangeStart: 850, rangeEnd: 850, country: 'Cuba', region: 'Caribbean' },
  { rangeStart: 858, rangeEnd: 858, country: 'Slovakia', region: 'Europe' },
  { rangeStart: 859, rangeEnd: 859, country: 'Czech Republic', region: 'Europe' },
  { rangeStart: 860, rangeEnd: 860, country: 'Serbia', region: 'Europe' },
  { rangeStart: 865, rangeEnd: 865, country: 'Mongolia', region: 'Asia' },
  { rangeStart: 867, rangeEnd: 867, country: 'North Korea', region: 'East Asia' },
  { rangeStart: 868, rangeEnd: 869, country: 'Turkey', region: 'Europe/Middle East' },
  { rangeStart: 870, rangeEnd: 879, country: 'Netherlands', region: 'Europe' },
  { rangeStart: 880, rangeEnd: 880, country: 'South Korea', region: 'East Asia' },
  { rangeStart: 884, rangeEnd: 884, country: 'Cambodia', region: 'Southeast Asia' },
  { rangeStart: 885, rangeEnd: 885, country: 'Thailand', region: 'Southeast Asia' },
  { rangeStart: 888, rangeEnd: 888, country: 'Singapore', region: 'Southeast Asia' },
  { rangeStart: 890, rangeEnd: 890, country: 'India (GS1 India)', region: 'South Asia' },
  { rangeStart: 893, rangeEnd: 893, country: 'Vietnam', region: 'Southeast Asia' },
  { rangeStart: 896, rangeEnd: 896, country: 'Pakistan', region: 'South Asia' },
  { rangeStart: 899, rangeEnd: 899, country: 'Indonesia', region: 'Southeast Asia' },
  { rangeStart: 900, rangeEnd: 919, country: 'Austria', region: 'Europe' },
  { rangeStart: 930, rangeEnd: 939, country: 'Australia', region: 'Oceania' },
  { rangeStart: 940, rangeEnd: 949, country: 'New Zealand', region: 'Oceania' },
  { rangeStart: 955, rangeEnd: 955, country: 'Malaysia', region: 'Southeast Asia' },
  { rangeStart: 958, rangeEnd: 958, country: 'Macau', region: 'East Asia' },
];

/**
 * Calculates GS1 Modulo-10 Check Digit for EAN-13, UPC-A, or EAN-8
 */
export function calculateGs1CheckDigit(digitsWithoutCheck: string): number {
  const digits = digitsWithoutCheck.replace(/\D/g, '').split('').map(Number);
  const len = digits.length;
  let sum = 0;

  // Weight pattern from right to left: 3, 1, 3, 1...
  for (let i = len - 1, weight = 3; i >= 0; i--, weight = weight === 3 ? 1 : 3) {
    sum += digits[i] * weight;
  }

  const remainder = sum % 10;
  return remainder === 0 ? 0 : 10 - remainder;
}

/**
 * Validates whether the last digit of a barcode is a mathematically valid GS1 Modulo-10 check digit
 */
export function validateGs1CheckDigit(fullCode: string): {
  isValid: boolean;
  actualCheckDigit: number;
  calculatedCheckDigit: number;
} {
  const clean = fullCode.replace(/\D/g, '');
  if (clean.length < 8 || clean.length > 14) {
    return { isValid: false, actualCheckDigit: -1, calculatedCheckDigit: -1 };
  }

  const digitsWithoutCheck = clean.slice(0, -1);
  const actualCheckDigit = Number(clean.slice(-1));
  const calculatedCheckDigit = calculateGs1CheckDigit(digitsWithoutCheck);

  return {
    isValid: actualCheckDigit === calculatedCheckDigit,
    actualCheckDigit,
    calculatedCheckDigit,
  };
}

/**
 * Resolves country of issuance from GS1 prefix
 */
export function resolveGs1Country(code: string): { prefix: string; country: string; region: string } {
  const clean = code.replace(/\D/g, '');
  if (!clean) {
    return { prefix: '', country: 'Unknown', region: 'Unknown' };
  }

  // Check 3-digit prefix first
  const prefix3 = parseInt(clean.substring(0, 3), 10);
  for (const entry of GS1_PREFIX_TABLE) {
    if (prefix3 >= entry.rangeStart && prefix3 <= entry.rangeEnd) {
      return { prefix: clean.substring(0, 3), country: entry.country, region: entry.region };
    }
  }

  // Check 2-digit prefix
  const prefix2 = parseInt(clean.substring(0, 2), 10);
  for (const entry of GS1_PREFIX_TABLE) {
    if (prefix2 >= entry.rangeStart && prefix2 <= entry.rangeEnd) {
      return { prefix: clean.substring(0, 2), country: entry.country, region: entry.region };
    }
  }

  return { prefix: clean.substring(0, 3), country: 'Unknown GS1 Prefix', region: 'Unknown' };
}

/**
 * Cross-Verifies Barcode GS1 Country of Origin against text label declarations
 */
export function verifyBarcodeProvenance(
  rawBarcode: string,
  textDeclaredCountry?: string,
  manufacturerDetails?: string
): BarcodeVerificationResult {
  const clean = rawBarcode.trim().replace(/\s+/g, '');
  const digitsOnly = clean.replace(/\D/g, '');

  let symbology: BarcodeVerificationResult['symbology'] = 'UNKNOWN';
  if (digitsOnly.length === 13) symbology = 'EAN_13';
  else if (digitsOnly.length === 12) symbology = 'UPC_A';
  else if (digitsOnly.length === 8) symbology = 'EAN_8';
  else if (digitsOnly.length === 14) symbology = 'EAN_13'; // GTIN-14
  else if (clean.length > 0) symbology = 'CODE_128';

  if (!digitsOnly || digitsOnly.length < 8) {
    return {
      detected: false,
      rawCode: rawBarcode,
      symbology: 'UNKNOWN',
      prefix: '',
      countryOfIssuance: 'None Detected',
      isCheckDigitValid: false,
      complianceVerdict: 'WARNING',
      provenanceMatchStatus: 'UNVERIFIABLE',
      observation: 'No valid numeric GTIN/EAN barcode detected on the package imagery.',
      legalCitation: 'Rule 6(1), Legal Metrology (Packaged Commodities) Rules, 2011',
    };
  }

  const { isValid: isCheckDigitValid, actualCheckDigit, calculatedCheckDigit } = validateGs1CheckDigit(digitsOnly);
  const { prefix, country: countryOfIssuance, region } = resolveGs1Country(digitsOnly);

  // Normalize text country of origin for comparison
  const textOrigin = (textDeclaredCountry || '').toLowerCase().trim();
  const mfgText = (manufacturerDetails || '').toLowerCase().trim();
  const countryNameLower = countryOfIssuance.toLowerCase();

  const isOriginIndia = textOrigin.includes('india') || mfgText.includes('india') || mfgText.includes('gujarat') || mfgText.includes('maharashtra') || mfgText.includes('karnataka') || mfgText.includes('delhi');
  const isGs1India = prefix === '890';

  let provenanceMatchStatus: BarcodeVerificationResult['provenanceMatchStatus'] = 'UNVERIFIABLE';
  let complianceVerdict: BarcodeVerificationResult['complianceVerdict'] = 'COMPLIANT';
  let observation = '';

  if (!isCheckDigitValid) {
    complianceVerdict = 'VIOLATION';
    provenanceMatchStatus = 'UNVERIFIABLE';
    observation = `Barcode check-digit fail: expected ${calculatedCheckDigit}, but barcode ends in ${actualCheckDigit}. Indicates damaged print or counterfeit uncertified symbology.`;
  } else if (isGs1India && isOriginIndia) {
    complianceVerdict = 'COMPLIANT';
    provenanceMatchStatus = 'VERIFIED_MATCH';
    observation = `Perfect provenance match: GS1 prefix '890' (India) matches declared Country of Origin 'India'.`;
  } else if (!isGs1India && isOriginIndia) {
    // E.g. Label claims Made in India, but barcode is China 690-699 or Vietnam 893
    complianceVerdict = 'VIOLATION';
    provenanceMatchStatus = 'SUSPECTED_MISMATCH';
    observation = `PROVENANCE MISMATCH: Package label claims 'Made in India' or Indian origin, but barcode is allocated to ${countryOfIssuance} (Prefix ${prefix}). Unless packed under licensed import, this constitutes deceptive origin declaration under Rule 6(1)(n).`;
  } else if (isGs1India && !isOriginIndia && textOrigin) {
    // Barcode 890, but label claims Made in China/USA
    complianceVerdict = 'WARNING';
    provenanceMatchStatus = 'THIRD_PARTY_LICENSEE';
    observation = `Barcode prefix '890' (GS1 India) registered to Indian brand/importer, but goods are declared as imported from '${textDeclaredCountry}'. Permitted under Rule 6(1)(a) provided Indian importer name & address is prominently declared.`;
  } else if (textOrigin && countryNameLower.includes(textOrigin)) {
    complianceVerdict = 'COMPLIANT';
    provenanceMatchStatus = 'VERIFIED_MATCH';
    observation = `Provenance matched: Barcode GS1 prefix '${prefix}' (${countryOfIssuance}) aligns with declared origin '${textDeclaredCountry}'.`;
  } else {
    complianceVerdict = isCheckDigitValid ? 'COMPLIANT' : 'WARNING';
    provenanceMatchStatus = 'UNVERIFIABLE';
    observation = `Barcode prefix '${prefix}' issued by ${countryOfIssuance} (${region}). Check digit valid.`;
  }

  return {
    detected: true,
    rawCode: digitsOnly,
    symbology,
    prefix,
    countryOfIssuance,
    isCheckDigitValid,
    calculatedCheckDigit,
    actualCheckDigit,
    textDeclaredOrigin: textDeclaredCountry,
    provenanceMatchStatus,
    complianceVerdict,
    observation,
    legalCitation: 'Rule 6(1)(n) & Section 36(1), Legal Metrology Act, 2009',
  };
}

/**
 * Attempts real client-side barcode decoding from an image using ZXing
 */
export async function decodeBarcodeFromCanvasOrImage(
  imageSource: string | HTMLCanvasElement | HTMLImageElement
): Promise<{ text: string; format: string } | null> {
  try {
    const ZXing = await getZXing();
    const {
      MultiFormatReader,
      BarcodeFormat,
      DecodeHintType,
      RGBLuminanceSource,
      BinaryBitmap,
      HybridBinarizer,
    } = ZXing;

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.UPC_A,
      BarcodeFormat.EAN_8,
      BarcodeFormat.CODE_128,
      BarcodeFormat.DATA_MATRIX,
      BarcodeFormat.QR_CODE,
    ]);
    hints.set(DecodeHintType.TRY_HARDER, true);

    const reader = new MultiFormatReader();
    reader.setHints(hints);

    let canvas: HTMLCanvasElement;
    if (typeof document === 'undefined') return null; // Server guard
    if (imageSource instanceof HTMLCanvasElement) {
      canvas = imageSource;
    } else {
      // Load image into temporary canvas
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = typeof imageSource === 'string' ? imageSource : imageSource.src;
      });

      canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.drawImage(img, 0, 0);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const luminances = new Uint8ClampedArray(canvas.width * canvas.height);
    for (let i = 0; i < luminances.length; i++) {
      const r = imgData.data[i * 4];
      const g = imgData.data[i * 4 + 1];
      const b = imgData.data[i * 4 + 2];
      luminances[i] = ((r + g + b) / 3) | 0;
    }

    const luminanceSource = new RGBLuminanceSource(luminances, canvas.width, canvas.height);
    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

    const result = reader.decode(binaryBitmap);
    if (result) {
      return {
        text: result.getText(),
        format: BarcodeFormat ? BarcodeFormat[result.getBarcodeFormat()] || 'EAN_13' : 'EAN_13',
      };
    }
    return null;
  } catch {
    // No barcode recognized on this pass
    return null;
  }
}
