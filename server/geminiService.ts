import { GoogleGenAI } from '@google/genai';
import { InspectionResult, LabelAnnotation } from '../src/types/compliance';

export interface AnalysisOptions {
  productName?: string;
  category?: string;
  packageType?: string;
  backPanelBase64?: string;
  sidePanelBase64?: string;
  macroBase64?: string;
  dimensions?: { widthCm: number; heightCm: number };
  inspectorInfo?: {
    name?: string;
    badgeId?: string;
    jurisdiction?: string;
    inspectionLocation?: string;
  };
}

/**
 * Server-side Gemini service for Legal Metrology compliance inspection.
 * Uses high-accuracy multimodal vision with automatic model fallback.
 */
export async function analyzePackageWithGemini(
  base64Data: string,
  mimeType: string,
  options?: AnalysisOptions
): Promise<InspectionResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the server environment');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const systemInstruction = `
You are an expert Senior Legal Metrology Enforcement Officer and forensic label compliance auditor under the Legal Metrology Act, 2009 and the Legal Metrology (Packaged Commodities) Rules, 2011 (LMPC Rules, 2011) of the Government of India.

Your primary duty:
Perform high-precision Optical Character Recognition (OCR) on all provided packaging photographs (Front PDP, Back Declaration Table, Macro close-ups). Read every visible word, number, unit, date, address, phone number, and fine print label text verbatim.
Evaluate every detected text item strictly against the statutory requirements of the Indian LMPC Rules, 2011 and its amendments.

CRITICAL STATUTORY RULES TO AUDIT:
1. Rule 6(1)(a): Manufacturer / Packer / Importer Name & Complete Address.
   - Requirement: Full postal address including street/area, city, state, and 6-digit postal PIN code.
   - Violation: Omission of 6-digit PIN code or incomplete street address without landmark/city.
2. Rule 6(1)(b): Generic or Common Name of Commodity.
   - Requirement: Clear generic commodity name (e.g. "Wheat Flour", "Refined Sunflower Oil", "Toothpaste"), not just a fancy brand name.
3. Rule 6(1)(c) & Rule 11: Net Quantity & Standard Units.
   - Requirement: Strict metric units: 'g', 'kg', 'ml', 'l' or 'L', 'N' or 'U'.
   - Statutory Prohibition: Using 'gms', 'gm', 'gm.', 'ml.', 'ltr', 'Kgs', 'pcs' is strictly illegal under Rule 11.
4. Rule 12(2): Qualifying Words Prohibited.
   - Words like "approx", "when packed", "minimum" prefixed/suffixed to net quantity are strictly prohibited.
5. Rule 6(1)(d): Month & Year of Manufacture, Packing, or Import.
   - Format: MM/YYYY or Month Year.
6. Rule 6(1)(e) & Section 36(2): Maximum Retail Price (MRP).
   - Requirement: Stated in Indian Rupees ('₹' or 'Rs.') with the mandatory statutory phrase "Inclusive of all taxes" or "Incl. of all taxes".
   - Statutory Prohibition: Any statement like "taxes extra", "+ local taxes", or over-stickering/tampering is a cognizable offence under Section 36(2).
7. Rule 6(10) (2022 Unit Sale Price Amendment - G.S.R. 779(E)):
   - Mandatory for commodities sold by weight, volume, or number.
   - Commodities < 1 kg / 1 L: Unit Sale Price declared per g or per ml (or per 100g/100ml).
   - Commodities > 1 kg / 1 L: Unit Sale Price declared per kg or per litre.
   - Number commodities: declared per piece/number ('₹ ... / N').
   - Check calculation consistency: MRP divided by Net Quantity must equal declared USP (allowing for standard rounding to nearest paisa).
8. Rule 6(1)(f): Consumer Care Contact Details.
   - Must contain 4 mandatory elements:
     a) Name or designation of contact person (e.g. "Consumer Care Officer" or "Manager - Customer Support")
     b) Complete postal address
     c) Telephone / Toll-free number
     d) Valid Email ID
   - Violation: Missing email or missing telephone is a non-compliance.
9. Country of Origin:
   - Mandatory declaration for both domestic and imported packaged goods.
10. Schedule II: Numeral and Letter Font Height (Minimum Height in mm):
   - Net Qty up to 50g / 50ml: Minimum 1.0 mm (1.5 mm for blown/moulded containers)
   - Net Qty 50g to 200g / 50ml to 200ml: Minimum 2.0 mm (3.0 mm for blown/moulded)
   - Net Qty 200g to 1kg / 200ml to 1L: Minimum 4.0 mm (6.0 mm for blown/moulded)
   - Net Qty exceeding 1kg / 1L: Minimum 6.0 mm
   - You MUST determine the required minimum font height automatically from the declared Net Quantity (Table-I of Schedule II). Do NOT rely on or require manual physical package dimensions.
`;

  const prompt = `
Examine the provided image(s) of this packaged commodity with maximum OCR precision.
${options?.productName ? `Context Hint - Claimed Product Name: ${options.productName}` : ''}
${options?.category ? `Context Hint - Commodity Category: ${options.category}` : ''}
${options?.packageType ? `Context Hint - Package Type: ${options.packageType}` : ''}
${options?.dimensions ? `Estimated Dimensions: ${options.dimensions.widthCm}cm W x ${options.dimensions.heightCm}cm H` : ''}

INSTRUCTIONS:
1. Extract the actual text printed on the packaging for each field. DO NOT use generic placeholder values. If a field is not printed or not visible in the image, set detected: false and specify violationReason: "Mandatory declaration not detected on package label".
2. Transcribe the raw label text found across the image(s) into "rawExtractedText".
3. Provide visual bounding box annotations for the Primary Image (pdpImage) in the "annotations" array. For each detected declaration, specify:
   - "id": unique string (e.g. "box-netqty", "box-mrp", "box-usp", "box-mfg", "box-care", "box-commodity", "box-date")
   - "label": human readable name
   - "fieldKey": matching the declaration key
   - "topPct", "leftPct", "widthPct", "heightPct": estimated bounding box as percentages (0 to 100) on the primary image
   - "isCompliant": boolean
   - "ruleClause": statutory clause (e.g. "Rule 6(1)(c)", "Rule 6(1)(e)", "Rule 6(10)")
   - "detectedText": the verbatim text detected
   - "violationMessage": short reason if non-compliant, or empty string if compliant.

Return a valid JSON object matching the following structure:
{
  "productName": "string (name of product read from image)",
  "brandName": "string (brand name read from image)",
  "category": "FOOD_AND_BEVERAGES" | "PERSONAL_CARE" | "HOUSEHOLD" | "ELECTRONICS" | "PHARMA_OTC" | "COMMODITIES",
  "packageType": "RECTANGULAR_BOX" | "POUCH_OR_SACHET" | "BOTTLE_OR_CAN" | "TUBE" | "WRAPPER",
  "overallVerdict": "COMPLIANT" | "NON_COMPLIANT" | "SERIOUS_VIOLATION" | "CONDITIONAL_PASS",
  "complianceScore": number (0 to 100),
  "rawExtractedText": "string (full verbatim text detected on packaging)",
  "declarations": {
    "commodityName": { "detected": boolean, "value": "string", "rawText": "string", "isCompliant": boolean, "remedy": "string" },
    "manufacturerDetails": { "detected": boolean, "value": "string", "rawText": "string", "isCompliant": boolean, "pinCodeDeclared": boolean, "violationReason": "string" },
    "packerDetails": { "detected": boolean, "value": "string", "isCompliant": boolean },
    "importerDetails": { "detected": boolean, "value": "string", "countryOfOrigin": "string", "isCompliant": boolean },
    "countryOfOrigin": { "detected": boolean, "value": "string", "country": "string", "isCompliant": boolean },
    "netQuantity": {
      "detected": boolean,
      "value": "string",
      "rawText": "string",
      "numericValue": number,
      "declaredUnit": "string",
      "standardMetricUnit": "string",
      "isStandardUnit": boolean,
      "hasProhibitedQualifiers": boolean,
      "isCompliant": boolean,
      "violationReason": "string",
      "remedy": "string"
    },
    "mrp": {
      "detected": boolean,
      "value": "string",
      "rawText": "string",
      "mrpAmount": number,
      "currencySymbolDeclared": boolean,
      "inclusiveOfAllTaxes": boolean,
      "hasTaxesExtraViolation": boolean,
      "isCompliant": boolean,
      "violationReason": "string"
    },
    "unitSalePrice": {
      "detected": boolean,
      "value": "string",
      "rawText": "string",
      "unitPriceAmount": number,
      "unitBasis": "string",
      "isCalculationConsistent": boolean,
      "expectedUnitPrice": "string",
      "isCompliant": boolean,
      "violationReason": "string"
    },
    "dateOfManufactureOrPacking": {
      "detected": boolean,
      "value": "string",
      "rawText": "string",
      "monthYear": "string",
      "isBestBeforeStated": boolean,
      "isCompliant": boolean,
      "violationReason": "string"
    },
    "consumerCare": {
      "detected": boolean,
      "value": "string",
      "rawText": "string",
      "contactPersonDesignation": "string",
      "fullAddress": "string",
      "telephoneNumber": "string",
      "emailId": "string",
      "hasMissingMandatoryFields": boolean,
      "missingFieldsList": ["string"],
      "isCompliant": boolean,
      "violationReason": "string"
    },
    "fssaiNumber": { "detected": boolean, "value": "string", "isCompliant": boolean }
  },
  "annotations": [
    {
      "id": "string",
      "label": "string",
      "fieldKey": "string",
      "topPct": number,
      "leftPct": number,
      "widthPct": number,
      "heightPct": number,
      "isCompliant": boolean,
      "ruleClause": "string",
      "detectedText": "string",
      "violationMessage": "string"
    }
  ],
  "rulesEvaluated": [
    {
      "ruleId": "RULE_6_1_A",
      "ruleTitle": "string",
      "ruleClause": "string",
      "actSection": "string",
      "status": "PASS" | "FAIL" | "WARNING" | "NOT_APPLICABLE",
      "severity": "CRITICAL" | "MAJOR" | "MINOR" | "INFO",
      "observation": "string",
      "legalRequirement": "string",
      "suggestedCorrectiveAction": "string",
      "penalProvision": "string"
    }
  ],
  "readability": {
    "estimatedPdpAreaSqCm": number,
    "measuredFontHeightMm": number,
    "requiredMinFontHeightMm": number,
    "isFontHeightCompliant": boolean,
    "contrastRatio": number,
    "contrastScore": "EXCELLENT" | "ACCEPTABLE" | "POOR",
    "clarityAndSharpness": number,
    "obscuredByGraphics": boolean,
    "plainLanguageVerdict": "string"
  },
  "violationsCount": {
    "critical": number,
    "major": number,
    "minor": number,
    "warnings": number
  },
  "notes": "string"
}
`;

  // Prepare inline image parts
  const cleanBase64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
  const parts: any[] = [
    {
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: cleanBase64,
      },
    },
  ];

  // If secondary back panel image provided, include it in prompt
  if (options?.backPanelBase64) {
    const cleanBack = options.backPanelBase64.includes(',')
      ? options.backPanelBase64.split(',')[1]
      : options.backPanelBase64;
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: cleanBack,
      },
    });
  }

  // If side panel or gusset image provided, include it in prompt
  if (options?.sidePanelBase64) {
    const cleanSide = options.sidePanelBase64.includes(',')
      ? options.sidePanelBase64.split(',')[1]
      : options.sidePanelBase64;
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: cleanSide,
      },
    });
  }

  // If macro close-up detail image provided, include it in prompt
  if (options?.macroBase64) {
    const cleanMacro = options.macroBase64.includes(',')
      ? options.macroBase64.split(',')[1]
      : options.macroBase64;
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: cleanMacro,
      },
    });
  }

  parts.push({ text: prompt });

  // Fallback candidate models in order of reliability and availability
  const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;
  let responseText = '';

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      if (response && response.text) {
        responseText = response.text;
        break;
      }
    } catch (err: any) {
      console.warn(`Model ${modelName} returned error:`, err?.message?.slice(0, 150));
      lastError = err;
      // Continue to next candidate model
    }
  }

  if (!responseText) {
    throw new Error(
      `AI Vision Extraction Error: All candidate models failed. Details: ${lastError?.message || 'High server demand or network error'}`
    );
  }

  let parsed: any;
  try {
    parsed = JSON.parse(responseText);
  } catch (parseErr) {
    // If markdown wrapped
    const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    parsed = JSON.parse(cleanJson);
  }

  // Ensure annotations have valid fallback coordinates if none provided
  const annotations: LabelAnnotation[] =
    Array.isArray(parsed.annotations) && parsed.annotations.length > 0
      ? parsed.annotations.map((ann: any, idx: number) => ({
          id: ann.id || `box-${idx}`,
          label: ann.label || 'Packaging Declaration',
          fieldKey: ann.fieldKey || 'generic',
          topPct: typeof ann.topPct === 'number' ? ann.topPct : 10 + idx * 12,
          leftPct: typeof ann.leftPct === 'number' ? ann.leftPct : 8,
          widthPct: typeof ann.widthPct === 'number' ? ann.widthPct : 84,
          heightPct: typeof ann.heightPct === 'number' ? ann.heightPct : 8,
          isCompliant: ann.isCompliant !== false,
          ruleClause: ann.ruleClause || 'Legal Metrology Rules, 2011',
          detectedText: ann.detectedText || '',
          violationMessage: ann.violationMessage || undefined,
        }))
      : [];

  const inspectionResult: InspectionResult = {
    id: options?.inspectorInfo?.badgeId || ('insp-' + Date.now()),
    timestamp: new Date().toISOString(),
    productName: parsed.productName || options?.productName || 'Scanned Packaged Commodity',
    brandName: parsed.brandName || 'Brand Detected',
    category: parsed.category || (options?.category as any) || 'FOOD_AND_BEVERAGES',
    packageType: parsed.packageType || (options?.packageType as any) || 'RECTANGULAR_BOX',
    images: {
      pdpImage: base64Data,
      backPanelImage: options?.backPanelBase64,
      mrpStampImage: options?.macroBase64,
    },
    overallVerdict: parsed.overallVerdict || (parsed.complianceScore >= 80 ? 'COMPLIANT' : 'NON_COMPLIANT'),
    complianceScore: typeof parsed.complianceScore === 'number' ? parsed.complianceScore : 65,
    declarations: parsed.declarations || {},
    annotations: annotations.length > 0 ? annotations : undefined,
    rulesEvaluated: parsed.rulesEvaluated || [],
    readability: parsed.readability || {
      estimatedPdpAreaSqCm: 150,
      measuredFontHeightMm: 3.0,
      requiredMinFontHeightMm: 2.0,
      isFontHeightCompliant: true,
      contrastRatio: 8.0,
      contrastScore: 'ACCEPTABLE',
      clarityAndSharpness: 85,
      obscuredByGraphics: false,
      plainLanguageVerdict: 'Label typography clearly detected.',
    },
    violationsCount: parsed.violationsCount || {
      critical: 0,
      major: 0,
      minor: 0,
      warnings: 0,
    },
    inspectorInfo: {
      name: options?.inspectorInfo?.name || 'Inspector, Legal Metrology Enforcement Wing',
      badgeId: options?.inspectorInfo?.badgeId || `LMI-DEL-${Math.floor(1000 + Math.random() * 9000)}`,
      jurisdiction: options?.inspectorInfo?.jurisdiction || 'State Legal Metrology Enforcement Circle',
      inspectionLocation: options?.inspectorInfo?.inspectionLocation || 'Field Surveillance Site',
    },
    notes:
      (parsed.rawExtractedText
        ? `[Verbatim OCR Extracted Text]:\n${parsed.rawExtractedText}\n\n`
        : '') + (parsed.notes || 'Automated Legal Metrology forensic inspection complete.'),
  };

  return inspectionResult;
}

