import { InspectionResult } from '../types/compliance';

export interface SamplePackageProduct {
  id: string;
  name: string;
  brand: string;
  category: InspectionResult['category'];
  packageType: InspectionResult['packageType'];
  description: string;
  expectedVerdict: InspectionResult['overallVerdict'];
  complianceScore: number;
  highlightedViolations: string[];
  thumbnailSvg: string;
  inspectionResult: InspectionResult;
}

export const SAMPLE_PRODUCTS: SamplePackageProduct[] = [
  {
    id: 'sample-atta-5kg',
    name: 'Shuddh Chakki Fresh Whole Wheat Atta',
    brand: 'Kisan Golden Gold',
    category: 'FOOD_AND_BEVERAGES',
    packageType: 'POUCH_OR_SACHET',
    description: 'Compliant 5 kg laminated pouch with all mandatory declarations under Rule 6 and 2022 USP amendment.',
    expectedVerdict: 'COMPLIANT',
    complianceScore: 98,
    highlightedViolations: [],
    thumbnailSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23fffbeb"/>
          <stop offset="100%" stop-color="%23fef3c7"/>
        </linearGradient>
      </defs>
      <rect width="400" height="500" rx="16" fill="url(%23g1)" stroke="%23d97706" stroke-width="4"/>
      <rect x="20" y="20" width="360" height="70" rx="8" fill="%23d97706"/>
      <text x="200" y="55" fill="%23ffffff" font-family="system-ui, sans-serif" font-size="22" font-weight="bold" text-anchor="middle">KISAN GOLDEN GOLD</text>
      <text x="200" y="75" fill="%23fef3c7" font-family="system-ui, sans-serif" font-size="13" text-anchor="middle">100% Whole Wheat Chakki Fresh Atta</text>
      
      <!-- PDP Declaration Area -->
      <rect x="30" y="110" width="340" height="150" rx="8" fill="%23ffffff" stroke="%23b45309" stroke-width="1.5"/>
      <text x="45" y="135" fill="%231e293b" font-family="system-ui, sans-serif" font-size="15" font-weight="bold">MANDATORY DECLARATIONS (LMPC 2011)</text>
      <text x="45" y="160" fill="%230f172a" font-family="system-ui, sans-serif" font-size="14">Net Quantity: <tspan font-weight="bold" fill="%23047857">5 kg</tspan> (Rule 6(1)(c) Compliant)</text>
      <text x="45" y="182" fill="%230f172a" font-family="system-ui, sans-serif" font-size="14">MRP: <tspan font-weight="bold">₹ 260.00</tspan> (Inclusive of all taxes)</text>
      <text x="45" y="204" fill="%230f172a" font-family="system-ui, sans-serif" font-size="14">Unit Sale Price (USP): <tspan font-weight="bold" fill="%23047857">₹ 52.00 / kg</tspan></text>
      <text x="45" y="226" fill="%230f172a" font-family="system-ui, sans-serif" font-size="13">Date of Pkg: 10/02/2026 | Best Before: 4 Months</text>
      <text x="45" y="246" fill="%230f172a" font-family="system-ui, sans-serif" font-size="13">Country of Origin: <tspan font-weight="bold">India</tspan></text>
      
      <!-- Manufacturer & Consumer Details -->
      <rect x="30" y="275" width="340" height="185" rx="8" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="1.5"/>
      <text x="45" y="298" fill="%23334155" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Mfd. & Packed by: Kisan Agro Foods Pvt. Ltd.</text>
      <text x="45" y="318" fill="%23475569" font-family="system-ui, sans-serif" font-size="12">Plot 45, Industrial Area, Whitefield, Bengaluru - 560066, Karnataka</text>
      <text x="45" y="338" fill="%23475569" font-family="system-ui, sans-serif" font-size="12">FSSAI Lic. No.: 10019043002981</text>
      <line x1="45" y1="348" x2="355" y2="348" stroke="%23e2e8f0" stroke-width="1"/>
      <text x="45" y="368" fill="%231e293b" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Consumer Care Officer:</text>
      <text x="45" y="388" fill="%23475569" font-family="system-ui, sans-serif" font-size="12">Address: Same as manufacturer address</text>
      <text x="45" y="406" fill="%23475569" font-family="system-ui, sans-serif" font-size="12">Toll Free: 1800-200-4545 | Email: customercare@kisanagro.in</text>
      <text x="45" y="426" fill="%23475569" font-family="system-ui, sans-serif" font-size="12">Website: www.kisanagro.in</text>
      <text x="45" y="446" fill="%23047857" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">✓ Complies with Rule 6(1)(a)-(f) & 2022 Amendment</text>
    </svg>`,
    inspectionResult: {
      id: 'insp-2026-001',
      timestamp: '2026-03-02T10:15:00Z',
      productName: 'Shuddh Chakki Fresh Whole Wheat Atta',
      brandName: 'Kisan Golden Gold',
      category: 'FOOD_AND_BEVERAGES',
      packageType: 'POUCH_OR_SACHET',
      images: {},
      overallVerdict: 'COMPLIANT',
      complianceScore: 98,
      declarations: {
        commodityName: {
          detected: true,
          value: 'Whole Wheat Chakki Fresh Atta',
          isCompliant: true,
          remedy: 'None required. Generic name clearly stated.'
        },
        manufacturerDetails: {
          detected: true,
          value: 'Kisan Agro Foods Pvt. Ltd., Plot 45, Industrial Area, Whitefield, Bengaluru - 560066, Karnataka, India',
          isCompliant: true,
          pinCodeDeclared: true
        },
        countryOfOrigin: {
          detected: true,
          value: 'India',
          country: 'India',
          isCompliant: true
        },
        netQuantity: {
          detected: true,
          value: '5 kg',
          numericValue: 5,
          declaredUnit: 'kg',
          standardMetricUnit: 'kg',
          isStandardUnit: true,
          hasProhibitedQualifiers: false,
          isCompliant: true,
          unitSalePriceDeclared: true
        },
        mrp: {
          detected: true,
          value: '₹ 260.00 (Inclusive of all taxes)',
          mrpAmount: 260.0,
          currencySymbolDeclared: true,
          inclusiveOfAllTaxes: true,
          hasTaxesExtraViolation: false,
          isCompliant: true
        },
        unitSalePrice: {
          detected: true,
          value: '₹ 52.00 / kg',
          unitPriceAmount: 52.0,
          unitBasis: 'per kg',
          isCalculationConsistent: true,
          expectedUnitPrice: '₹ 52.00 / kg',
          isCompliant: true
        },
        dateOfManufactureOrPacking: {
          detected: true,
          value: '10/02/2026',
          monthYear: '02/2026',
          isBestBeforeStated: true,
          isCompliant: true
        },
        consumerCare: {
          detected: true,
          value: 'Consumer Care Officer, Kisan Agro Foods Pvt. Ltd., Plot 45, Whitefield, Bengaluru - 560066. Toll Free: 1800-200-4545, Email: customercare@kisanagro.in',
          contactPersonDesignation: 'Consumer Care Officer',
          fullAddress: 'Plot 45, Industrial Area, Whitefield, Bengaluru - 560066',
          telephoneNumber: '1800-200-4545',
          emailId: 'customercare@kisanagro.in',
          hasMissingMandatoryFields: false,
          missingFieldsList: [],
          isCompliant: true
        },
        fssaiNumber: {
          detected: true,
          value: '10019043002981',
          isCompliant: true
        }
      },
      rulesEvaluated: [
        {
          ruleId: 'RULE_6_1_A',
          ruleTitle: 'Name and Address of Manufacturer/Packer',
          ruleClause: 'Rule 6(1)(a)',
          actSection: 'Section 18, Legal Metrology Act, 2009',
          status: 'PASS',
          severity: 'CRITICAL',
          observation: 'Complete registered factory address with valid 6-digit postal PIN code (560066) provided.',
          legalRequirement: 'Every package shall bear the name and complete address of the manufacturer or packer.',
          suggestedCorrectiveAction: 'Complies fully.',
          penalProvision: 'Section 36(1) penalty inapplicable.'
        },
        {
          ruleId: 'RULE_6_1_B',
          ruleTitle: 'Generic or Common Name of Commodity',
          ruleClause: 'Rule 6(1)(b)',
          actSection: 'Section 18, Legal Metrology Act, 2009',
          status: 'PASS',
          severity: 'MAJOR',
          observation: 'Generic identity "Whole Wheat Chakki Fresh Atta" clearly printed on Principal Display Panel.',
          legalRequirement: 'The common or generic names of the commodity contained in the package shall be stated.',
          suggestedCorrectiveAction: 'Complies fully.',
          penalProvision: 'Section 36(1) penalty inapplicable.'
        },
        {
          ruleId: 'RULE_6_1_C',
          ruleTitle: 'Net Quantity in Standard Metric Units',
          ruleClause: 'Rule 6(1)(c) read with Rule 11 & Rule 12',
          actSection: 'Section 18 read with Section 36, Legal Metrology Act, 2009',
          status: 'PASS',
          severity: 'CRITICAL',
          observation: 'Net quantity declared as "5 kg" using standard symbol without illegal abbreviations or qualifiers.',
          legalRequirement: 'Net quantity shall be declared in standard units of weight (g or kg) without qualifying terms like approx.',
          suggestedCorrectiveAction: 'Complies fully.',
          penalProvision: 'Compliant with Rule 11.'
        },
        {
          ruleId: 'RULE_6_1_E_MRP',
          ruleTitle: 'Maximum Retail Price Declaration & Tax Inclusion',
          ruleClause: 'Rule 6(1)(e)',
          actSection: 'Section 18 read with Section 36(2), Legal Metrology Act, 2009',
          status: 'PASS',
          severity: 'CRITICAL',
          observation: 'MRP declared as ₹ 260.00 with the mandatory "Inclusive of all taxes" text.',
          legalRequirement: 'MRP shall clearly mention "inclusive of all taxes" and Indian Rupee symbol.',
          suggestedCorrectiveAction: 'Complies fully.',
          penalProvision: 'Section 36(2) penalty inapplicable.'
        },
        {
          ruleId: 'RULE_6_10_USP',
          ruleTitle: 'Unit Sale Price (USP) Declaration (2022 Amendment)',
          ruleClause: 'Rule 6(10) / Rule 6(1)(e)',
          actSection: 'Notification G.S.R. 779(E) effective Dec 2022',
          status: 'PASS',
          severity: 'MAJOR',
          observation: 'USP declared as "₹ 52.00 / kg" (₹260 / 5 kg = ₹52.00 / kg). Mathematically correct.',
          legalRequirement: 'Packages with net quantity > 1 kg must declare Unit Sale Price per kilogram rounded to two decimal places.',
          suggestedCorrectiveAction: 'Complies fully.',
          penalProvision: 'Section 36(1) penalty inapplicable.'
        },
        {
          ruleId: 'RULE_6_1_D',
          ruleTitle: 'Month and Year of Manufacture/Packing',
          ruleClause: 'Rule 6(1)(d)',
          actSection: 'Section 18, Legal Metrology Act, 2009',
          status: 'PASS',
          severity: 'MAJOR',
          observation: 'Date of Packing "10/02/2026" clearly marked.',
          legalRequirement: 'Month and year in which commodity is manufactured or packed must be prominently stated.',
          suggestedCorrectiveAction: 'Complies fully.',
          penalProvision: 'Compliant.'
        },
        {
          ruleId: 'RULE_6_1_F_CONSUMER_CARE',
          ruleTitle: 'Consumer Care Contact Details',
          ruleClause: 'Rule 6(1)(f)',
          actSection: 'Section 18 read with Section 36(1)',
          status: 'PASS',
          severity: 'CRITICAL',
          observation: 'Designation, Postal Address, Toll-Free Phone, and valid Email ID all present.',
          legalRequirement: 'Must contain name/designation, address, telephone number, and email ID for consumer complaints.',
          suggestedCorrectiveAction: 'Complies fully.',
          penalProvision: 'Compliant.'
        },
        {
          ruleId: 'RULE_7_FONT_HEIGHT',
          ruleTitle: 'Principal Display Panel & Minimum Font Height',
          ruleClause: 'Rule 7 & Rule 8, Schedule II',
          actSection: 'Rule 8 of LMPC Rules, 2011',
          status: 'PASS',
          severity: 'MAJOR',
          observation: 'Numeral height for 5 kg package is 6.5 mm (Schedule II requires min. 6.0 mm for >1 kg).',
          legalRequirement: 'For packages above 1 kg, the minimum height of numerals for net quantity is 6.0 mm.',
          suggestedCorrectiveAction: 'Complies with Schedule II font scale.',
          penalProvision: 'Compliant.'
        }
      ],
      readability: {
        estimatedPdpAreaSqCm: 480,
        measuredFontHeightMm: 6.5,
        requiredMinFontHeightMm: 6.0,
        isFontHeightCompliant: true,
        contrastRatio: 12.4,
        contrastScore: 'EXCELLENT',
        clarityAndSharpness: 96,
        obscuredByGraphics: false,
        plainLanguageVerdict: 'Crisp font on contrasting white background without decorative obscurities.'
      },
      violationsCount: {
        critical: 0,
        major: 0,
        minor: 0,
        warnings: 0
      },
      inspectorInfo: {
        name: 'Rajesh Sharma',
        badgeId: 'LMI-KA-0941',
        jurisdiction: 'Bangalore Central Division, Karnataka',
        inspectionLocation: 'Supermarket Hub, Indiranagar'
      }
    }
  },
  {
    id: 'sample-biscuits-150g',
    name: 'Crispy Butter Crunch Cookies',
    brand: 'Golden Bakery Biscuits',
    category: 'FOOD_AND_BEVERAGES',
    packageType: 'WRAPPER',
    description: 'Non-compliant biscuit pack: uses illegal non-standard unit "150 gms", missing Unit Sale Price (USP), and missing consumer care email address.',
    expectedVerdict: 'NON_COMPLIANT',
    complianceScore: 48,
    highlightedViolations: [
      'Non-standard metric unit "150 gms" (Violation of Rule 11 - must be "150 g")',
      'Missing mandatory Unit Sale Price (USP) per gram (Violation of Rule 6(10))',
      'Incomplete Consumer Care details - Email address missing (Violation of Rule 6(1)(f))'
    ],
    thumbnailSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
      <rect width="400" height="500" rx="16" fill="%23fff1f2" stroke="%23e11d48" stroke-width="4"/>
      <rect x="20" y="20" width="360" height="70" rx="8" fill="%23e11d48"/>
      <text x="200" y="55" fill="%23ffffff" font-family="system-ui, sans-serif" font-size="20" font-weight="bold" text-anchor="middle">CRISPY BUTTER CRUNCH</text>
      <text x="200" y="75" fill="%23ffe4e6" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">Rich Butter Baked Cookies</text>
      
      <!-- PDP Declaration Area with Violations highlighted -->
      <rect x="30" y="110" width="340" height="150" rx="8" fill="%23ffffff" stroke="%23e11d48" stroke-width="2"/>
      <text x="45" y="135" fill="%23e11d48" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">PACKAGE DECLARATIONS (NON-COMPLIANT)</text>
      
      <!-- Net Qty Violation -->
      <rect x="40" y="145" width="220" height="26" fill="%23fee2e2" rx="4"/>
      <text x="45" y="163" fill="%23991b1b" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">Net Wt.: 150 gms [ILLEGAL 'gms']</text>
      
      <text x="45" y="192" fill="%230f172a" font-family="system-ui, sans-serif" font-size="14">MRP: ₹ 35.00 (Incl. of all taxes)</text>
      
      <!-- Missing USP Warning -->
      <rect x="40" y="202" width="320" height="26" fill="%23fee2e2" rx="4"/>
      <text x="45" y="220" fill="%23991b1b" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Unit Sale Price (USP): [NOT DECLARED]</text>
      
      <text x="45" y="248" fill="%230f172a" font-family="system-ui, sans-serif" font-size="12">Pkd: Jan 2026 | Batch: BB409</text>
      
      <!-- Consumer Details with Missing Email -->
      <rect x="30" y="275" width="340" height="190" rx="8" fill="%23fff" stroke="%23e11d48" stroke-width="1.5"/>
      <text x="45" y="300" fill="%23334155" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Mfd by: Sunrise Bakers Ltd.</text>
      <text x="45" y="320" fill="%23475569" font-family="system-ui, sans-serif" font-size="12">G.T. Karnal Road, Delhi - 110036</text>
      <line x1="45" y1="335" x2="355" y2="335" stroke="%23fecdd3" stroke-width="1"/>
      <text x="45" y="355" fill="%231e293b" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Customer Feedback:</text>
      <text x="45" y="375" fill="%23475569" font-family="system-ui, sans-serif" font-size="12">Phone: +91 9876543210</text>
      
      <rect x="40" y="388" width="320" height="26" fill="%23fee2e2" rx="4"/>
      <text x="45" y="405" fill="%23991b1b" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">Email: [MISSING - Violation of Rule 6(1)(f)]</text>
      
      <text x="45" y="435" fill="%23dc2626" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">⚠ Liable for Notice under Sec 18 &amp; 36</text>
    </svg>`,
    inspectionResult: {
      id: 'insp-2026-002',
      timestamp: '2026-03-02T11:30:00Z',
      productName: 'Crispy Butter Crunch Cookies',
      brandName: 'Golden Bakery Biscuits',
      category: 'FOOD_AND_BEVERAGES',
      packageType: 'WRAPPER',
      images: {},
      overallVerdict: 'NON_COMPLIANT',
      complianceScore: 48,
      declarations: {
        commodityName: {
          detected: true,
          value: 'Cookies / Biscuits',
          isCompliant: true
        },
        manufacturerDetails: {
          detected: true,
          value: 'Sunrise Bakers Ltd., G.T. Karnal Road, Delhi - 110036, India',
          isCompliant: true,
          pinCodeDeclared: true
        },
        countryOfOrigin: {
          detected: true,
          value: 'India',
          isCompliant: true
        },
        netQuantity: {
          detected: true,
          value: '150 gms',
          numericValue: 150,
          declaredUnit: 'gms',
          standardMetricUnit: 'g',
          isStandardUnit: false,
          hasProhibitedQualifiers: false,
          isCompliant: false,
          violationReason: 'Illegal unit symbol "gms". Rule 11 strictly mandates standard symbol "g" for grams.',
          remedy: 'Amend packaging printing cylinder to replace "gms" with "g".'
        },
        mrp: {
          detected: true,
          value: '₹ 35.00 (Incl. of all taxes)',
          mrpAmount: 35.0,
          currencySymbolDeclared: true,
          inclusiveOfAllTaxes: true,
          hasTaxesExtraViolation: false,
          isCompliant: true
        },
        unitSalePrice: {
          detected: false,
          value: '',
          expectedUnitPrice: '₹ 0.23 / g (or ₹ 23.33 per 100g)',
          isCompliant: false,
          violationReason: 'Unit Sale Price (USP) not declared. Mandatory for packages under 1 kg.',
          remedy: 'Print Unit Sale Price as "₹ 0.23 / g" or "₹ 23.33 / 100g" adjacent to MRP.'
        },
        dateOfManufactureOrPacking: {
          detected: true,
          value: 'Jan 2026',
          monthYear: '01/2026',
          isCompliant: true
        },
        consumerCare: {
          detected: true,
          value: 'Customer Feedback Phone: +91 9876543210, Sunrise Bakers Ltd., Delhi',
          telephoneNumber: '+91 9876543210',
          emailId: undefined,
          hasMissingMandatoryFields: true,
          missingFieldsList: ['Email Address', 'Designation of Officer'],
          isCompliant: false,
          violationReason: 'Missing mandatory email address and official designation for consumer complaints.',
          remedy: 'Include designated email address and designation (e.g. Consumer Care Officer).'
        }
      },
      rulesEvaluated: [
        {
          ruleId: 'RULE_11_UNITS',
          ruleTitle: 'Standard Metric Units of Weight',
          ruleClause: 'Rule 11 & Rule 12',
          actSection: 'Section 18 read with Section 36(1), Legal Metrology Act, 2009',
          status: 'FAIL',
          severity: 'CRITICAL',
          observation: 'Net quantity printed as "150 gms". Under Rule 11, the only recognized symbol for gram is "g". "gms" is prohibited.',
          legalRequirement: 'Standard symbol for mass in metric system is "g" (gram) or "kg" (kilogram). No plural or abbreviation allowed.',
          suggestedCorrectiveAction: 'Immediately update printing sleeves/plates to "150 g". Withdraw non-standard packaging.',
          penalProvision: 'Compoundable fine up to ₹25,000 for first offence under Section 36(1).'
        },
        {
          ruleId: 'RULE_6_10_USP',
          ruleTitle: 'Mandatory Unit Sale Price (USP)',
          ruleClause: 'Rule 6(10) / Rule 6(1)(e)',
          actSection: 'Notification G.S.R. 779(E) effective Dec 2022',
          status: 'FAIL',
          severity: 'MAJOR',
          observation: 'Package completely omits Unit Sale Price. Required: ₹ 0.23 / g or ₹ 23.33 / 100g.',
          legalRequirement: 'All pre-packaged commodities must bear unit sale price per gram or per 100g when net quantity is below 1 kg.',
          suggestedCorrectiveAction: 'Affix supplementary compliant sticker with Unit Sale Price until batch packaging is exhausted.',
          penalProvision: 'Liable for penalty under Rule 32 and Section 36.'
        },
        {
          ruleId: 'RULE_6_1_F_CONSUMER_CARE',
          ruleTitle: 'Consumer Care Contact Details (Email Missing)',
          ruleClause: 'Rule 6(1)(f)',
          actSection: 'Section 18 read with Section 36(1)',
          status: 'FAIL',
          severity: 'MAJOR',
          observation: 'Package prints telephone number but omits email address and designated officer title.',
          legalRequirement: 'Rule 6(1)(f) mandates 4 distinct elements: Designation, Address, Telephone, and Email ID.',
          suggestedCorrectiveAction: 'Include email ID and designation on label.',
          penalProvision: 'Notice of violation under Section 18.'
        },
        {
          ruleId: 'RULE_6_1_A',
          ruleTitle: 'Manufacturer Name and Complete Address',
          ruleClause: 'Rule 6(1)(a)',
          actSection: 'Section 18, Legal Metrology Act, 2009',
          status: 'PASS',
          severity: 'CRITICAL',
          observation: 'Sunrise Bakers Ltd., G.T. Karnal Road, Delhi - 110036 declared with valid PIN code.',
          legalRequirement: 'Full name and complete address with pin code.',
          suggestedCorrectiveAction: 'None required.',
          penalProvision: 'Compliant.'
        },
        {
          ruleId: 'RULE_6_1_E_MRP',
          ruleTitle: 'MRP Declaration & Taxes Inclusive',
          ruleClause: 'Rule 6(1)(e)',
          actSection: 'Section 18, Legal Metrology Act, 2009',
          status: 'PASS',
          severity: 'CRITICAL',
          observation: 'MRP declared as ₹ 35.00 with "Incl. of all taxes".',
          legalRequirement: 'Clear price declaration including taxes.',
          suggestedCorrectiveAction: 'Ensure USP is also displayed alongside.',
          penalProvision: 'Compliant.'
        }
      ],
      readability: {
        estimatedPdpAreaSqCm: 140,
        measuredFontHeightMm: 2.5,
        requiredMinFontHeightMm: 2.0,
        isFontHeightCompliant: true,
        contrastRatio: 6.8,
        contrastScore: 'ACCEPTABLE',
        clarityAndSharpness: 82,
        obscuredByGraphics: false,
        plainLanguageVerdict: 'Font is legible, but mandatory declarations are missing or in non-standard syntax.'
      },
      violationsCount: {
        critical: 1,
        major: 2,
        minor: 0,
        warnings: 0
      },
      inspectorInfo: {
        name: 'Rajesh Sharma',
        badgeId: 'LMI-KA-0941',
        jurisdiction: 'Bangalore Central Division, Karnataka',
        inspectionLocation: 'Supermarket Hub, Indiranagar'
      }
    }
  },
  {
    id: 'sample-chocolate-imported',
    name: 'Belgian Premium 70% Dark Chocolate Bar',
    brand: 'ChocLux International',
    category: 'FOOD_AND_BEVERAGES',
    packageType: 'RECTANGULAR_BOX',
    description: 'Imported commodity with serious violations: "Taxes Extra" sticker, missing Country of Origin on retail carton, and importer address missing postal PIN code.',
    expectedVerdict: 'SERIOUS_VIOLATION',
    complianceScore: 35,
    highlightedViolations: [
      'Stated "MRP ₹ 190.00 + Local Taxes Extra" (Severe violation under Section 36(2) - Taxes extra is strictly illegal)',
      'Missing Country of Origin declaration on outer packaging (Violation of Rule 6(10) / Govt Notification)',
      'Incomplete Importer Address: Missing PIN code and full city/state details (Violation of Rule 6(1)(a))'
    ],
    thumbnailSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
      <rect width="400" height="500" rx="16" fill="%23451a03" stroke="%23991b1b" stroke-width="4"/>
      <rect x="20" y="20" width="360" height="70" rx="8" fill="%2378350f"/>
      <text x="200" y="55" fill="%23fde047" font-family="serif" font-size="22" font-weight="bold" text-anchor="middle">CHOCLUX ARTISAN</text>
      <text x="200" y="75" fill="%23fef3c7" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">70% Intense Dark Cocoa Bar (100g)</text>
      
      <!-- Sticker on imported item with severe violations -->
      <rect x="30" y="110" width="340" height="200" rx="8" fill="%23ffffff" stroke="%23dc2626" stroke-width="3"/>
      <text x="45" y="135" fill="%23dc2626" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">IMPORTER STICKER (SERIOUS OFFENCES)</text>
      
      <!-- Taxes Extra illegal declaration -->
      <rect x="40" y="145" width="320" height="32" fill="%23fee2e2" rx="4"/>
      <text x="45" y="166" fill="%23b91c1c" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">MRP: ₹ 190.00 + LOCAL TAXES EXTRA</text>
      
      <!-- Missing Country of origin -->
      <rect x="40" y="185" width="320" height="26" fill="%23fee2e2" rx="4"/>
      <text x="45" y="202" fill="%23b91c1c" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Country of Origin: [NOT DECLARED]</text>
      
      <!-- Incomplete Address -->
      <rect x="40" y="218" width="320" height="38" fill="%23fee2e2" rx="4"/>
      <text x="45" y="234" fill="%23b91c1c" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">Imported by: ChocLux Trading, MG Road</text>
      <text x="45" y="250" fill="%23b91c1c" font-family="system-ui, sans-serif" font-size="11">[INCOMPLETE ADDRESS - NO PIN CODE OR CITY]</text>
      
      <text x="45" y="280" fill="%23475569" font-family="system-ui, sans-serif" font-size="12">Net Qty: 100 g | Pkd/Import: 11/2025</text>
      <text x="45" y="300" fill="%23dc2626" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">Unit Sale Price: Missing</text>
      
      <!-- Warning box -->
      <rect x="30" y="325" width="340" height="145" rx="8" fill="%23fef2f2" stroke="%23b91c1c" stroke-width="2"/>
      <text x="45" y="355" fill="%23991b1b" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">LEGAL METROLOGY ACT CONTRAVENTION</text>
      <text x="45" y="380" fill="%237f1d1d" font-family="system-ui, sans-serif" font-size="12">• Sec 36(2): Selling/labeling taxes extra is punishable</text>
      <text x="45" y="400" fill="%237f1d1d" font-family="system-ui, sans-serif" font-size="12">• Foreign Trade Policy &amp; LMPC: Mandatory origin missing</text>
      <text x="45" y="420" fill="%237f1d1d" font-family="system-ui, sans-serif" font-size="12">• Seizure Memo liable to be issued immediately</text>
      <text x="45" y="450" fill="%23b91c1c" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Action: Seize under Section 15 / Form 1 Notice</text>
    </svg>`,
    inspectionResult: {
      id: 'insp-2026-003',
      timestamp: '2026-03-02T14:10:00Z',
      productName: 'Belgian Premium 70% Dark Chocolate Bar',
      brandName: 'ChocLux International',
      category: 'FOOD_AND_BEVERAGES',
      packageType: 'RECTANGULAR_BOX',
      images: {},
      overallVerdict: 'SERIOUS_VIOLATION',
      complianceScore: 35,
      declarations: {
        commodityName: {
          detected: true,
          value: 'Dark Chocolate Bar',
          isCompliant: true
        },
        manufacturerDetails: {
          detected: true,
          value: 'ChocLux SA, Brussels, Belgium',
          isCompliant: true
        },
        importerDetails: {
          detected: true,
          value: 'ChocLux Trading, MG Road',
          countryOfOrigin: undefined,
          isCompliant: false,
          violationReason: 'Incomplete importer address: Lacks town/city, state, and 6-digit postal PIN code.'
        },
        countryOfOrigin: {
          detected: false,
          value: '',
          isCompliant: false,
          violationReason: 'Country of Origin is completely missing from outer consumer packaging.'
        },
        netQuantity: {
          detected: true,
          value: '100 g',
          numericValue: 100,
          declaredUnit: 'g',
          standardMetricUnit: 'g',
          isStandardUnit: true,
          hasProhibitedQualifiers: false,
          isCompliant: true
        },
        mrp: {
          detected: true,
          value: '₹ 190.00 + Local Taxes Extra',
          mrpAmount: 190.0,
          currencySymbolDeclared: true,
          inclusiveOfAllTaxes: false,
          hasTaxesExtraViolation: true,
          isCompliant: false,
          violationReason: '"Local Taxes Extra" declaration is strictly prohibited under Rule 6(1)(e). MRP must be inclusive of all taxes.',
          remedy: 'Re-label with all-inclusive price.'
        },
        unitSalePrice: {
          detected: false,
          value: '',
          expectedUnitPrice: '₹ 1.90 / g',
          isCompliant: false,
          violationReason: 'Missing Unit Sale Price.',
          remedy: 'Declare USP as ₹ 1.90 / g.'
        },
        dateOfManufactureOrPacking: {
          detected: true,
          value: '11/2025',
          monthYear: '11/2025',
          isCompliant: true
        },
        consumerCare: {
          detected: false,
          value: '',
          hasMissingMandatoryFields: true,
          missingFieldsList: ['Telephone Number', 'Email ID', 'Postal Address'],
          isCompliant: false,
          violationReason: 'No consumer care contact details found on importer sticker.'
        }
      },
      rulesEvaluated: [
        {
          ruleId: 'RULE_6_1_E_MRP',
          ruleTitle: 'Taxes Extra Prohibition on MRP',
          ruleClause: 'Rule 6(1)(e) read with Section 36(2)',
          actSection: 'Section 36(2), Legal Metrology Act, 2009',
          status: 'FAIL',
          severity: 'CRITICAL',
          observation: 'Sticker states "₹ 190.00 + Local Taxes Extra". Levying or quoting taxes extra is illegal in India.',
          legalRequirement: 'MRP must be stated as "inclusive of all taxes". No separate tax surcharge can be charged or stated.',
          suggestedCorrectiveAction: 'Immediately withdraw stock from retail shelf. Re-label with inclusive MRP.',
          penalProvision: 'Penalty up to ₹50,000 for second offence, compounding or prosecution under Section 36(2).'
        },
        {
          ruleId: 'RULE_COUNTRY_OF_ORIGIN',
          ruleTitle: 'Country of Origin for Imported Commodity',
          ruleClause: 'Rule 6(10) / Govt Notification',
          actSection: 'Section 18, Legal Metrology Act, 2009',
          status: 'FAIL',
          severity: 'CRITICAL',
          observation: 'Package completely omits Country of Origin statement on the consumer carton.',
          legalRequirement: 'Name of the country of origin or manufacture shall be mentioned on imported packages.',
          suggestedCorrectiveAction: 'Affix compliant declaration sticker declaring Country of Origin (e.g., Belgium).',
          penalProvision: 'Seizure of goods under Section 15.'
        },
        {
          ruleId: 'RULE_6_1_A',
          ruleTitle: 'Complete Importer Address with PIN Code',
          ruleClause: 'Rule 6(1)(a)',
          actSection: 'Section 18 read with Section 36(1)',
          status: 'FAIL',
          severity: 'MAJOR',
          observation: 'Importer address is merely given as "ChocLux Trading, MG Road". Missing city, state and PIN code.',
          legalRequirement: 'Every package shall bear complete address of the importer including postal index number (PIN).',
          suggestedCorrectiveAction: 'Provide full registered address and valid PIN code.',
          penalProvision: 'Fine up to ₹25,000 under Section 36(1).'
        },
        {
          ruleId: 'RULE_6_1_F_CONSUMER_CARE',
          ruleTitle: 'Consumer Care Cell Details',
          ruleClause: 'Rule 6(1)(f)',
          actSection: 'Section 18 read with Section 36(1)',
          status: 'FAIL',
          severity: 'CRITICAL',
          observation: 'No consumer contact phone, email, or care address printed on the importer label.',
          legalRequirement: 'Mandatory consumer care telephone, email and office address.',
          suggestedCorrectiveAction: 'Add customer care contact details.',
          penalProvision: 'Section 36(1) penalty.'
        }
      ],
      readability: {
        estimatedPdpAreaSqCm: 160,
        measuredFontHeightMm: 1.6,
        requiredMinFontHeightMm: 2.0,
        isFontHeightCompliant: false,
        contrastRatio: 4.2,
        contrastScore: 'POOR',
        clarityAndSharpness: 70,
        obscuredByGraphics: true,
        plainLanguageVerdict: 'Font is cramped on supplementary sticker; font height fails minimum 2.0 mm threshold.'
      },
      violationsCount: {
        critical: 3,
        major: 1,
        minor: 0,
        warnings: 0
      },
      inspectorInfo: {
        name: 'Rajesh Sharma',
        badgeId: 'LMI-KA-0941',
        jurisdiction: 'Bangalore Central Division, Karnataka',
        inspectionLocation: 'Supermarket Hub, Indiranagar'
      }
    }
  },
  {
    id: 'sample-oil-1l',
    name: 'Kachi Ghani Cold Pressed Mustard Oil',
    brand: 'Sarson Khet Premium',
    category: 'FOOD_AND_BEVERAGES',
    packageType: 'BOTTLE_OR_CAN',
    description: 'Edible oil pet bottle with illegal abbreviation "1 ltr", undersized font height for 1 litre container, and missing consumer phone number.',
    expectedVerdict: 'NON_COMPLIANT',
    complianceScore: 55,
    highlightedViolations: [
      'Illegal unit abbreviation "1 ltr" (Rule 11 mandates "1 l" or "1 L")',
      'Font height for Net Quantity is only 2.4 mm (Schedule II mandates min 4.0 mm for >200ml up to 1L)',
      'Missing consumer care telephone number'
    ],
    thumbnailSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
      <rect width="400" height="500" rx="16" fill="%23fefce8" stroke="%23ca8a04" stroke-width="4"/>
      <rect x="20" y="20" width="360" height="70" rx="8" fill="%23ca8a04"/>
      <text x="200" y="55" fill="%23ffffff" font-family="system-ui, sans-serif" font-size="20" font-weight="bold" text-anchor="middle">SARSON KHET PURE</text>
      <text x="200" y="75" fill="%23fef9c3" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">Kachi Ghani Mustard Oil</text>
      
      <rect x="30" y="110" width="340" height="160" rx="8" fill="%23ffffff" stroke="%23ca8a04" stroke-width="1.5"/>
      <text x="45" y="135" fill="%23854d0e" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">LABEL ANALYSIS</text>
      
      <!-- Illegal ltr & small font -->
      <rect x="40" y="145" width="320" height="26" fill="%23fef2f2" rx="4"/>
      <text x="45" y="163" fill="%23b91c1c" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Net Vol.: 1 ltr [ILLEGAL 'ltr' + 2.4mm FONT]</text>
      
      <text x="45" y="195" fill="%230f172a" font-family="system-ui, sans-serif" font-size="14">MRP: ₹ 175.00 (Incl. of all taxes)</text>
      <text x="45" y="220" fill="%230f172a" font-family="system-ui, sans-serif" font-size="14">Unit Sale Price: ₹ 175.00 / l</text>
      <text x="45" y="245" fill="%23475569" font-family="system-ui, sans-serif" font-size="12">Pkd: 02/2026 | FSSAI: 10020051000342</text>
      
      <rect x="30" y="285" width="340" height="180" rx="8" fill="%23fff" stroke="%23ca8a04" stroke-width="1"/>
      <text x="45" y="310" fill="%23334155" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Sarson Agro Mills, Alwar, Rajasthan - 301001</text>
      <line x1="45" y1="325" x2="355" y2="325" stroke="%23fef08a" stroke-width="1"/>
      <text x="45" y="348" fill="%231e293b" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Consumer Care:</text>
      <text x="45" y="370" fill="%23475569" font-family="system-ui, sans-serif" font-size="12">Email: care@sarsonkhet.com</text>
      <rect x="40" y="380" width="320" height="26" fill="%23fee2e2" rx="4"/>
      <text x="45" y="398" fill="%23b91c1c" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">Phone: [MISSING - Violation of Rule 6(1)(f)]</text>
      <text x="45" y="430" fill="%23dc2626" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">Schedule II font failure: 2.4mm &lt; 4.0mm requirement</text>
    </svg>`,
    inspectionResult: {
      id: 'insp-2026-004',
      timestamp: '2026-03-02T16:00:00Z',
      productName: 'Kachi Ghani Cold Pressed Mustard Oil',
      brandName: 'Sarson Khet Premium',
      category: 'FOOD_AND_BEVERAGES',
      packageType: 'BOTTLE_OR_CAN',
      images: {},
      overallVerdict: 'NON_COMPLIANT',
      complianceScore: 55,
      declarations: {
        commodityName: {
          detected: true,
          value: 'Mustard Oil',
          isCompliant: true
        },
        manufacturerDetails: {
          detected: true,
          value: 'Sarson Agro Mills, Industrial Area, Alwar, Rajasthan - 301001',
          isCompliant: true,
          pinCodeDeclared: true
        },
        countryOfOrigin: {
          detected: true,
          value: 'India',
          isCompliant: true
        },
        netQuantity: {
          detected: true,
          value: '1 ltr',
          numericValue: 1,
          declaredUnit: 'ltr',
          standardMetricUnit: 'l',
          isStandardUnit: false,
          hasProhibitedQualifiers: false,
          isCompliant: false,
          violationReason: 'Illegal symbol "ltr". Rule 11 mandates the symbol "l" or "L" or "ml" for volume.'
        },
        mrp: {
          detected: true,
          value: '₹ 175.00 (Incl. of all taxes)',
          mrpAmount: 175.0,
          currencySymbolDeclared: true,
          inclusiveOfAllTaxes: true,
          hasTaxesExtraViolation: false,
          isCompliant: true
        },
        unitSalePrice: {
          detected: true,
          value: '₹ 175.00 / l',
          unitPriceAmount: 175.0,
          unitBasis: 'per l',
          isCalculationConsistent: true,
          expectedUnitPrice: '₹ 175.00 / l',
          isCompliant: true
        },
        dateOfManufactureOrPacking: {
          detected: true,
          value: '02/2026',
          monthYear: '02/2026',
          isCompliant: true
        },
        consumerCare: {
          detected: true,
          value: 'Email: care@sarsonkhet.com, Sarson Agro Mills, Alwar',
          emailId: 'care@sarsonkhet.com',
          telephoneNumber: undefined,
          hasMissingMandatoryFields: true,
          missingFieldsList: ['Telephone Number', 'Designation'],
          isCompliant: false,
          violationReason: 'Customer care telephone number not provided.'
        }
      },
      rulesEvaluated: [
        {
          ruleId: 'RULE_11_UNITS',
          ruleTitle: 'Standard Metric Symbol for Volume',
          ruleClause: 'Rule 11',
          actSection: 'Section 18 read with Section 36(1)',
          status: 'FAIL',
          severity: 'MAJOR',
          observation: 'Unit declared as "1 ltr". Under Legal Metrology Rule 11, the only allowed unit symbols are "l" or "L".',
          legalRequirement: 'Symbol for litre is strictly "l" or "L". Abbreviations like "ltr", "ltrs" are unlawful.',
          suggestedCorrectiveAction: 'Correct label template to read "1 l" or "1 L".',
          penalProvision: 'Fine under Section 36(1).'
        },
        {
          ruleId: 'RULE_7_FONT_HEIGHT',
          ruleTitle: 'Minimum Font Height of Numerals (Schedule II)',
          ruleClause: 'Rule 7 & Rule 8, Table 1',
          actSection: 'Rule 8, Legal Metrology (PC) Rules, 2011',
          status: 'FAIL',
          severity: 'MAJOR',
          observation: 'Measured numeral height for Net Volume is only 2.4 mm. Required: minimum 4.0 mm for >200ml to 1L.',
          legalRequirement: 'Containers exceeding 200 ml up to 1 litre must have minimum numeral height of 4.0 mm.',
          suggestedCorrectiveAction: 'Increase font size of "1 L" to at least 4.0 mm on front panel.',
          penalProvision: 'Rule 32 penalty.'
        },
        {
          ruleId: 'RULE_6_1_F_CONSUMER_CARE',
          ruleTitle: 'Consumer Care Phone Number Missing',
          ruleClause: 'Rule 6(1)(f)',
          actSection: 'Section 18, Legal Metrology Act, 2009',
          status: 'FAIL',
          severity: 'MAJOR',
          observation: 'Consumer care email is provided, but telephone number is absent.',
          legalRequirement: 'Both telephone number and email ID must be displayed.',
          suggestedCorrectiveAction: 'Print telephone/toll-free number on bottle label.',
          penalProvision: 'Section 36(1).'
        }
      ],
      readability: {
        estimatedPdpAreaSqCm: 220,
        measuredFontHeightMm: 2.4,
        requiredMinFontHeightMm: 4.0,
        isFontHeightCompliant: false,
        contrastRatio: 8.5,
        contrastScore: 'ACCEPTABLE',
        clarityAndSharpness: 88,
        obscuredByGraphics: false,
        plainLanguageVerdict: 'Font is sharp, but physical height is 40% below statutory minimum.'
      },
      violationsCount: {
        critical: 0,
        major: 3,
        minor: 0,
        warnings: 0
      },
      inspectorInfo: {
        name: 'Rajesh Sharma',
        badgeId: 'LMI-KA-0941',
        jurisdiction: 'Bangalore Central Division, Karnataka',
        inspectionLocation: 'Supermarket Hub, Indiranagar'
      }
    }
  },
  {
    id: 'sample-facecream-50ml',
    name: 'Glow Radiance Night Cream Tube',
    brand: 'Aura Derma Cosmetics',
    category: 'PERSONAL_CARE',
    packageType: 'TUBE',
    description: 'Personal care tube containing prohibited qualifier "Approx. 50 ml" (Rule 12(2) violation) and missing packing month.',
    expectedVerdict: 'NON_COMPLIANT',
    complianceScore: 50,
    highlightedViolations: [
      'Prohibited qualifier "Approx. 50 ml" (Violation of Rule 12(2) - Words like "approx", "min", "when packed" strictly banned)',
      'Month and Year of packing/manufacture missing from tube crimp'
    ],
    thumbnailSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
      <rect width="400" height="500" rx="16" fill="%23fdf4ff" stroke="%23a855f7" stroke-width="4"/>
      <rect x="20" y="20" width="360" height="70" rx="8" fill="%23a855f7"/>
      <text x="200" y="55" fill="%23ffffff" font-family="system-ui, sans-serif" font-size="20" font-weight="bold" text-anchor="middle">AURA DERMA COSMETICS</text>
      <text x="200" y="75" fill="%23fae8ff" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">Glow Radiance Night Cream Tube</text>
      
      <rect x="30" y="110" width="340" height="160" rx="8" fill="%23ffffff" stroke="%23c084fc" stroke-width="1.5"/>
      <text x="45" y="135" fill="%237e22ce" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">TUBE BACK DECLARATION</text>
      
      <!-- Prohibited Qualifier -->
      <rect x="40" y="145" width="320" height="28" fill="%23fee2e2" rx="4"/>
      <text x="45" y="165" fill="%23b91c1c" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Net Qty: Approx. 50 ml [BANNED QUALIFIER]</text>
      
      <text x="45" y="195" fill="%230f172a" font-family="system-ui, sans-serif" font-size="14">MRP: ₹ 299.00 (Incl. of all taxes)</text>
      <text x="45" y="220" fill="%230f172a" font-family="system-ui, sans-serif" font-size="14">USP: ₹ 5.98 / ml</text>
      
      <rect x="40" y="232" width="320" height="26" fill="%23fee2e2" rx="4"/>
      <text x="45" y="250" fill="%23b91c1c" font-family="system-ui, sans-serif" font-size="12" font-weight="bold">Mfg/Packing Date: [MISSING FROM TUBE]</text>
      
      <rect x="30" y="285" width="340" height="180" rx="8" fill="%23fff" stroke="%23c084fc" stroke-width="1"/>
      <text x="45" y="310" fill="%23334155" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Aura Derma Labs Pvt. Ltd.</text>
      <text x="45" y="330" fill="%23475569" font-family="system-ui, sans-serif" font-size="12">Baddi, Solan, Himachal Pradesh - 173205</text>
      <text x="45" y="350" fill="%23475569" font-family="system-ui, sans-serif" font-size="12">Customer Care: 01795-244110 | support@auraderma.in</text>
      <text x="45" y="380" fill="%23b91c1c" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Rule 12(2) Violation: "Approx" is strictly illegal</text>
      <text x="45" y="405" fill="%23475569" font-family="system-ui, sans-serif" font-size="12">Net quantity must be definite and unqualified.</text>
    </svg>`,
    inspectionResult: {
      id: 'insp-2026-005',
      timestamp: '2026-03-02T16:45:00Z',
      productName: 'Glow Radiance Night Cream Tube',
      brandName: 'Aura Derma Cosmetics',
      category: 'PERSONAL_CARE',
      packageType: 'TUBE',
      images: {},
      overallVerdict: 'NON_COMPLIANT',
      complianceScore: 50,
      declarations: {
        commodityName: {
          detected: true,
          value: 'Night Cream',
          isCompliant: true
        },
        manufacturerDetails: {
          detected: true,
          value: 'Aura Derma Labs Pvt. Ltd., Baddi, Solan, HP - 173205',
          isCompliant: true,
          pinCodeDeclared: true
        },
        countryOfOrigin: {
          detected: true,
          value: 'India',
          isCompliant: true
        },
        netQuantity: {
          detected: true,
          value: 'Approx. 50 ml',
          numericValue: 50,
          declaredUnit: 'ml',
          standardMetricUnit: 'ml',
          isStandardUnit: true,
          hasProhibitedQualifiers: true,
          isCompliant: false,
          violationReason: 'Word "Approx." used. Rule 12(2) specifically prohibits qualifying words such as "approximate", "minimum", "when packed".',
          remedy: 'Remove "Approx." and state "Net Qty: 50 ml".'
        },
        mrp: {
          detected: true,
          value: '₹ 299.00 (Incl. of all taxes)',
          mrpAmount: 299.0,
          currencySymbolDeclared: true,
          inclusiveOfAllTaxes: true,
          hasTaxesExtraViolation: false,
          isCompliant: true
        },
        unitSalePrice: {
          detected: true,
          value: '₹ 5.98 / ml',
          unitPriceAmount: 5.98,
          unitBasis: 'per ml',
          isCalculationConsistent: true,
          expectedUnitPrice: '₹ 5.98 / ml',
          isCompliant: true
        },
        dateOfManufactureOrPacking: {
          detected: false,
          value: '',
          isCompliant: false,
          violationReason: 'Month and Year of packing/manufacture not stamped on tube or crimp.'
        },
        consumerCare: {
          detected: true,
          value: 'support@auraderma.in, 01795-244110, Baddi',
          telephoneNumber: '01795-244110',
          emailId: 'support@auraderma.in',
          hasMissingMandatoryFields: false,
          missingFieldsList: [],
          isCompliant: true
        }
      },
      rulesEvaluated: [
        {
          ruleId: 'RULE_12_QUALIFIERS',
          ruleTitle: 'Prohibition of Qualifying Words in Net Quantity',
          ruleClause: 'Rule 12(2)',
          actSection: 'Section 18 read with Section 36(1)',
          status: 'FAIL',
          severity: 'CRITICAL',
          observation: 'Net quantity declared with qualifying word "Approx. 50 ml". Rule 12(2) strictly prohibits any words that tend to qualify a declaration of net quantity.',
          legalRequirement: 'No declaration of quantity shall contain words qualifying it, such as "approximate", "minimum", "not less than", "when packed".',
          suggestedCorrectiveAction: 'Delete "Approx." and re-label with definite net quantity "50 ml".',
          penalProvision: 'Penalty under Section 36(1).'
        },
        {
          ruleId: 'RULE_6_1_D',
          ruleTitle: 'Month and Year of Manufacture/Packing',
          ruleClause: 'Rule 6(1)(d)',
          actSection: 'Section 18, Legal Metrology Act, 2009',
          status: 'FAIL',
          severity: 'MAJOR',
          observation: 'Month and year of manufacture or packing missing from the crimp and body of tube.',
          legalRequirement: 'Mandatory declaration of month and year of manufacture or packaging.',
          suggestedCorrectiveAction: 'Emboss month and year on tube crimp.',
          penalProvision: 'Section 36(1) penalty.'
        }
      ],
      readability: {
        estimatedPdpAreaSqCm: 65,
        measuredFontHeightMm: 1.8,
        requiredMinFontHeightMm: 1.5,
        isFontHeightCompliant: true,
        contrastRatio: 9.1,
        contrastScore: 'EXCELLENT',
        clarityAndSharpness: 92,
        obscuredByGraphics: false,
        plainLanguageVerdict: 'Font is clear, but qualifying word is an express legal violation.'
      },
      violationsCount: {
        critical: 1,
        major: 1,
        minor: 0,
        warnings: 0
      },
      inspectorInfo: {
        name: 'Rajesh Sharma',
        badgeId: 'LMI-KA-0941',
        jurisdiction: 'Bangalore Central Division, Karnataka',
        inspectionLocation: 'Supermarket Hub, Indiranagar'
      }
    }
  },
  {
    id: 'sample-detergent-1kg',
    name: 'Eco-Clean Active Bio Detergent Powder',
    brand: 'GreenFuture Household',
    category: 'HOUSEHOLD',
    packageType: 'RECTANGULAR_BOX',
    description: 'Fully compliant 1 kg laundry carton with complete Principal Display Panel font standards, USP, and FSSAI/corporate disclosures.',
    expectedVerdict: 'COMPLIANT',
    complianceScore: 100,
    highlightedViolations: [],
    thumbnailSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
      <rect width="400" height="500" rx="16" fill="%23f0fdf4" stroke="%2316a34a" stroke-width="4"/>
      <rect x="20" y="20" width="360" height="70" rx="8" fill="%2316a34a"/>
      <text x="200" y="55" fill="%23ffffff" font-family="system-ui, sans-serif" font-size="20" font-weight="bold" text-anchor="middle">ECO-CLEAN ACTIVE BIO</text>
      <text x="200" y="75" fill="%23dcfce7" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">Laundry Detergent Powder (1 kg)</text>
      
      <rect x="30" y="110" width="340" height="150" rx="8" fill="%23ffffff" stroke="%2316a34a" stroke-width="1.5"/>
      <text x="45" y="135" fill="%2315803d" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">100% COMPLIANT PACKAGING</text>
      <text x="45" y="160" fill="%230f172a" font-family="system-ui, sans-serif" font-size="14">Net Weight: <tspan font-weight="bold" fill="%2315803d">1 kg</tspan> (Numeral Height: 4.5 mm)</text>
      <text x="45" y="185" fill="%230f172a" font-family="system-ui, sans-serif" font-size="14">MRP: <tspan font-weight="bold">₹ 140.00</tspan> (Inclusive of all taxes)</text>
      <text x="45" y="210" fill="%230f172a" font-family="system-ui, sans-serif" font-size="14">Unit Sale Price (USP): <tspan font-weight="bold">₹ 140.00 / kg</tspan></text>
      <text x="45" y="235" fill="%230f172a" font-family="system-ui, sans-serif" font-size="13">Mfg Date: 01/2026 | Made in India</text>
      
      <rect x="30" y="275" width="340" height="185" rx="8" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="1"/>
      <text x="45" y="300" fill="%23334155" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">GreenFuture Homecare Pvt. Ltd.</text>
      <text x="45" y="320" fill="%23475569" font-family="system-ui, sans-serif" font-size="12">Survey No. 88, Vapi GIDC, Gujarat - 396195</text>
      <line x1="45" y1="335" x2="355" y2="335" stroke="%23e2e8f0" stroke-width="1"/>
      <text x="45" y="355" fill="%231e293b" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">Customer Care Cell:</text>
      <text x="45" y="375" fill="%23475569" font-family="system-ui, sans-serif" font-size="12">Officer-in-Charge, GreenFuture Care Desk</text>
      <text x="45" y="395" fill="%23475569" font-family="system-ui, sans-serif" font-size="12">Phone: 1800-419-8800 | Email: care@greenfuture.co.in</text>
      <text x="45" y="420" fill="%2315803d" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">✓ Inspection Passed - All Legal Metrology Rules Met</text>
    </svg>`,
    inspectionResult: {
      id: 'insp-2026-006',
      timestamp: '2026-03-02T17:30:00Z',
      productName: 'Eco-Clean Active Bio Detergent Powder',
      brandName: 'GreenFuture Household',
      category: 'HOUSEHOLD',
      packageType: 'RECTANGULAR_BOX',
      images: {},
      overallVerdict: 'COMPLIANT',
      complianceScore: 100,
      declarations: {
        commodityName: {
          detected: true,
          value: 'Detergent Powder',
          isCompliant: true
        },
        manufacturerDetails: {
          detected: true,
          value: 'GreenFuture Homecare Pvt. Ltd., Survey No. 88, Vapi GIDC, Gujarat - 396195, India',
          isCompliant: true,
          pinCodeDeclared: true
        },
        countryOfOrigin: {
          detected: true,
          value: 'India',
          isCompliant: true
        },
        netQuantity: {
          detected: true,
          value: '1 kg',
          numericValue: 1,
          declaredUnit: 'kg',
          standardMetricUnit: 'kg',
          isStandardUnit: true,
          hasProhibitedQualifiers: false,
          isCompliant: true,
          unitSalePriceDeclared: true
        },
        mrp: {
          detected: true,
          value: '₹ 140.00 (Inclusive of all taxes)',
          mrpAmount: 140.0,
          currencySymbolDeclared: true,
          inclusiveOfAllTaxes: true,
          hasTaxesExtraViolation: false,
          isCompliant: true
        },
        unitSalePrice: {
          detected: true,
          value: '₹ 140.00 / kg',
          unitPriceAmount: 140.0,
          unitBasis: 'per kg',
          isCalculationConsistent: true,
          expectedUnitPrice: '₹ 140.00 / kg',
          isCompliant: true
        },
        dateOfManufactureOrPacking: {
          detected: true,
          value: '01/2026',
          monthYear: '01/2026',
          isCompliant: true
        },
        consumerCare: {
          detected: true,
          value: 'Officer-in-Charge, GreenFuture Care Desk, Vapi GIDC, Gujarat - 396195. Phone: 1800-419-8800, Email: care@greenfuture.co.in',
          contactPersonDesignation: 'Officer-in-Charge',
          fullAddress: 'Survey No. 88, Vapi GIDC, Gujarat - 396195',
          telephoneNumber: '1800-419-8800',
          emailId: 'care@greenfuture.co.in',
          hasMissingMandatoryFields: false,
          missingFieldsList: [],
          isCompliant: true
        }
      },
      rulesEvaluated: [
        {
          ruleId: 'RULE_6_1_A',
          ruleTitle: 'Name and Complete Address of Manufacturer',
          ruleClause: 'Rule 6(1)(a)',
          actSection: 'Section 18, Legal Metrology Act, 2009',
          status: 'PASS',
          severity: 'CRITICAL',
          observation: 'Full manufacturer address with PIN code 396195 provided.',
          legalRequirement: 'Name and address of manufacturer with postal code.',
          suggestedCorrectiveAction: 'Complies fully.',
          penalProvision: 'Compliant.'
        },
        {
          ruleId: 'RULE_6_1_C',
          ruleTitle: 'Net Quantity in Standard Units',
          ruleClause: 'Rule 6(1)(c) & Rule 11',
          actSection: 'Section 18 read with Section 36(1)',
          status: 'PASS',
          severity: 'CRITICAL',
          observation: 'Net quantity declared as "1 kg". Standard metric unit.',
          legalRequirement: 'Standard unit of mass (kg or g).',
          suggestedCorrectiveAction: 'Complies fully.',
          penalProvision: 'Compliant.'
        },
        {
          ruleId: 'RULE_6_1_E_MRP',
          ruleTitle: 'MRP Declaration & Tax Inclusion',
          ruleClause: 'Rule 6(1)(e)',
          actSection: 'Section 18, Legal Metrology Act, 2009',
          status: 'PASS',
          severity: 'CRITICAL',
          observation: '₹ 140.00 inclusive of all taxes clearly printed.',
          legalRequirement: 'Price with taxes inclusive.',
          suggestedCorrectiveAction: 'Complies fully.',
          penalProvision: 'Compliant.'
        },
        {
          ruleId: 'RULE_6_10_USP',
          ruleTitle: 'Unit Sale Price (USP)',
          ruleClause: 'Rule 6(10)',
          actSection: 'Notification G.S.R. 779(E)',
          status: 'PASS',
          severity: 'MAJOR',
          observation: 'USP declared as "₹ 140.00 / kg". Matches MRP / net quantity.',
          legalRequirement: 'Unit sale price per kg.',
          suggestedCorrectiveAction: 'Complies fully.',
          penalProvision: 'Compliant.'
        },
        {
          ruleId: 'RULE_6_1_F_CONSUMER_CARE',
          ruleTitle: 'Consumer Care Details',
          ruleClause: 'Rule 6(1)(f)',
          actSection: 'Section 18 read with Section 36(1)',
          status: 'PASS',
          severity: 'CRITICAL',
          observation: 'Designation, Postal Address, Toll-Free Number, and valid Email all declared.',
          legalRequirement: 'Full consumer grievance contact details.',
          suggestedCorrectiveAction: 'Complies fully.',
          penalProvision: 'Compliant.'
        }
      ],
      readability: {
        estimatedPdpAreaSqCm: 320,
        measuredFontHeightMm: 4.5,
        requiredMinFontHeightMm: 4.0,
        isFontHeightCompliant: true,
        contrastRatio: 11.2,
        contrastScore: 'EXCELLENT',
        clarityAndSharpness: 95,
        obscuredByGraphics: false,
        plainLanguageVerdict: 'High contrast green/white typography with clear hierarchy and font height compliance.'
      },
      violationsCount: {
        critical: 0,
        major: 0,
        minor: 0,
        warnings: 0
      },
      inspectorInfo: {
        name: 'Rajesh Sharma',
        badgeId: 'LMI-KA-0941',
        jurisdiction: 'Bangalore Central Division, Karnataka',
        inspectionLocation: 'Supermarket Hub, Indiranagar'
      }
    }
  }
];
