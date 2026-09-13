/**
 * Smart QR Code Decoder & 2022 LMPC Electronic Exemption Verifier
 * Implements Notification G.S.R. 540(E) (Legal Metrology Packaged Commodities Electronic Amendments)
 */

import { SmartQrVerificationResult, ExtractedDeclarations } from '../types/compliance';
import { getApiBaseUrl } from '../services/complianceEngine';

// Lazy loader for jsQR to prevent CJS/ESM bundling conflicts
let jsQrPromise: Promise<any> | null = null;
async function getJsQR() {
  if (!jsQrPromise) {
    jsQrPromise = import('jsqr').then((m) => (m as any).default || m);
  }
  return jsQrPromise;
}

export interface QrDecodedPayload {
  rawPayload: string;
  payloadType: 'URL' | 'GS1_DIGITAL_LINK' | 'FSSAI_VERIFY' | 'PLAIN_TEXT';
  location?: {
    topLeft: { x: number; y: number };
    topRight: { x: number; y: number };
    bottomRight: { x: number; y: number };
    bottomLeft: { x: number; y: number };
  };
}

/**
 * Decodes QR code directly from image data using jsQR
 */
export async function decodeQrFromImage(
  imageSource: string | HTMLCanvasElement | HTMLImageElement
): Promise<QrDecodedPayload | null> {
  try {
    const jsQR = await getJsQR();
    let canvas: HTMLCanvasElement;
    if (typeof document === 'undefined') return null; // Server guard
    if (imageSource instanceof HTMLCanvasElement) {
      canvas = imageSource;
    } else {
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
    const code = jsQR(imgData.data, canvas.width, canvas.height, {
      inversionAttempts: 'attemptBoth',
    });

    if (code && code.data) {
      const trimmed = code.data.trim();
      let payloadType: QrDecodedPayload['payloadType'] = 'PLAIN_TEXT';

      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        if (trimmed.includes('id.gs1.org') || trimmed.includes('/01/')) {
          payloadType = 'GS1_DIGITAL_LINK';
        } else if (trimmed.includes('fssai.gov.in') || trimmed.includes('foscos')) {
          payloadType = 'FSSAI_VERIFY';
        } else {
          payloadType = 'URL';
        }
      }

      return {
        rawPayload: trimmed,
        payloadType,
        location: {
          topLeft: code.location.topLeftCorner,
          topRight: code.location.topRightCorner,
          bottomRight: code.location.bottomRightCorner,
          bottomLeft: code.location.bottomLeftCorner,
        },
      };
    }
    return null;
  } catch (err) {
    console.warn('QR Code scan error:', err);
    return null;
  }
}

/**
 * Checks compliance of a QR code under the 2022 LMPC Electronic Amendment (G.S.R. 540(E))
 */
export function evaluateLmpcQrExemption(
  qrPayload: string,
  declarations?: Partial<ExtractedDeclarations>,
  category?: string
): SmartQrVerificationResult {
  const isElectronic = category === 'ELECTRONICS' || category === 'HOUSEHOLD';
  const raw = (qrPayload || '').trim();

  // Physical label mandatory declarations must never be replaced by QR:
  const mrpOnPack = Boolean(declarations?.mrp?.detected && declarations?.mrp?.value);
  const netQtyOnPack = Boolean(declarations?.netQuantity?.detected && declarations?.netQuantity?.value);
  const nameOnPack = Boolean(declarations?.commodityName?.detected && declarations?.commodityName?.value);
  const consumerCareOnPack = Boolean(declarations?.consumerCare?.detected && declarations?.consumerCare?.value);

  const physicalPreserved = {
    mrpPrintedOnPack: mrpOnPack,
    netQtyPrintedOnPack: netQtyOnPack,
    commodityNamePrintedOnPack: nameOnPack,
    consumerCarePrintedOnPack: consumerCareOnPack,
  };

  if (!raw) {
    return {
      detected: false,
      rawPayload: '',
      payloadType: 'UNKNOWN',
      electronicExemptionApplicable: isElectronic,
      mandatoryPhysicalLabelPreserved: physicalPreserved,
      complianceStatus: 'NOT_APPLICABLE',
      observation: 'No QR code detected on package.',
      legalCitation: 'Notification G.S.R. 540(E), Legal Metrology (Packaged Commodities) (Second Amendment) Rules, 2022',
    };
  }

  const isUrl = raw.startsWith('http://') || raw.startsWith('https://');
  const payloadType = isUrl
    ? raw.includes('id.gs1.org') || raw.includes('/01/')
      ? 'GS1_DIGITAL_LINK'
      : 'URL'
    : 'PLAIN_TEXT';

  // Rule: Physical pack MUST still have MRP, Net Qty, Commodity Name, and Consumer Care:
  if (!mrpOnPack || !netQtyOnPack || !nameOnPack) {
    return {
      detected: true,
      rawPayload: raw,
      payloadType,
      electronicExemptionApplicable: isElectronic,
      mandatoryPhysicalLabelPreserved: physicalPreserved,
      complianceStatus: 'ILLEGAL_PHYSICAL_OMISSION',
      observation:
        'CRITICAL VIOLATION: Under 2022 Electronic Exemption Notification G.S.R. 540(E), MRP, Net Quantity, and Commodity Name MUST be physically printed on the package. Relegating these mandatory fields solely to a QR code is strictly illegal.',
      legalCitation: 'G.S.R. 540(E) Clause 2 read with Section 18/36, Legal Metrology Act, 2009',
    };
  }

  return {
    detected: true,
    rawPayload: raw,
    payloadType,
    electronicExemptionApplicable: isElectronic,
    mandatoryPhysicalLabelPreserved: physicalPreserved,
    complianceStatus: isUrl ? 'COMPLIANT_WITH_EXEMPTION' : 'PENDING_VERIFICATION',
    observation: isUrl
      ? `QR Code detected pointing to ${raw}. Mandatory physical core declarations (MRP, Net Qty, Commodity Name) are preserved on pack.`
      : `QR Code detected with text/serial data: "${raw.substring(0, 50)}...".`,
    legalCitation: 'Notification G.S.R. 540(E), Legal Metrology (Packaged Commodities) (Second Amendment) Rules, 2022',
  };
}

/**
 * Real Server Verification: Pings and extracts live declarations from the target QR URL
 */
export async function verifyLiveQrEndpoint(targetUrl: string): Promise<{
  ok: boolean;
  httpStatus: number;
  isAccessible: boolean;
  detectedDeclarations: {
    manufacturerNameAndAddress: boolean;
    commonGenericName: boolean;
    sizeAndDimensions: boolean;
    countryOfOrigin: boolean;
    consumerCareDetails: boolean;
    warrantyOrCustomerGuide: boolean;
  };
  sampleText?: string;
  error?: string;
}> {
  const base = getApiBaseUrl();
  const endpoint = `${base}/api/verify-qr-url`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: targetUrl }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }

    return {
      ok: false,
      httpStatus: res.status,
      isAccessible: false,
      detectedDeclarations: {
        manufacturerNameAndAddress: false,
        commonGenericName: false,
        sizeAndDimensions: false,
        countryOfOrigin: false,
        consumerCareDetails: false,
        warrantyOrCustomerGuide: false,
      },
      error: `Server returned HTTP ${res.status}`,
    };
  } catch (err: any) {
    return {
      ok: false,
      httpStatus: 0,
      isAccessible: false,
      detectedDeclarations: {
        manufacturerNameAndAddress: false,
        commonGenericName: false,
        sizeAndDimensions: false,
        countryOfOrigin: false,
        consumerCareDetails: false,
        warrantyOrCustomerGuide: false,
      },
      error: err?.message || 'Network request failed',
    };
  }
}
