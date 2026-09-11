export interface StatutoryRule {
  ruleCode: string;
  ruleTitle: string;
  actReference: string;
  penaltySection: string;
  summary: string;
  fullStatutoryText: string;
  commonViolations: string[];
  correctPractice: string;
}

export const STATUTORY_RULES: StatutoryRule[] = [
  {
    ruleCode: 'RULE_6_1_A',
    ruleTitle: 'Name and Complete Address of Manufacturer / Packer / Importer',
    actReference: 'Rule 6(1)(a) of Legal Metrology (Packaged Commodities) Rules, 2011',
    penaltySection: 'Section 18 read with Section 36(1) of Legal Metrology Act, 2009',
    summary: 'Every package shall bear the name and complete address of the manufacturer, or where manufacturer is not the packer, both name and address; for imported goods, the name, address and country of origin of importer.',
    fullStatutoryText: 'Every package shall bear thereon or on label securely affixed thereto, the name and complete address of the manufacturer, or where the manufacturer is not the packer, the name and address of the manufacturer and packer and for any imported commodity, the name and complete address of the importer with postal index number (PIN).',
    commonViolations: [
      'Missing postal index number (PIN code)',
      'Declaring only "Marketed by" or brand name without registered factory/packer address',
      'Vague address without street or municipality (e.g., merely "Baddi, HP")',
      'Missing Indian importer address on imported items'
    ],
    correctPractice: 'State complete registered factory address including plot number, industrial area, city, state, and 6-digit PIN code.'
  },
  {
    ruleCode: 'RULE_6_1_B',
    ruleTitle: 'Generic or Common Name of Commodity',
    actReference: 'Rule 6(1)(b) of LMPC Rules, 2011',
    penaltySection: 'Section 18 read with Section 36(1) of LM Act, 2009',
    summary: 'Every package must distinctly state the generic or common name of the commodity contained in the package.',
    fullStatutoryText: 'The common or generic names of the commodity contained in the package and in case of packages with more than one product, the name and quantity of each product shall be specified on the package.',
    commonViolations: [
      'Printing only proprietary trademark/brand name without generic description',
      'Misleading classification that obscures product nature',
      'Multi-packs without individual commodity breakdown'
    ],
    correctPractice: 'Include generic name (e.g. "Wheat Flour", "Detergent Powder", "Biscuit") prominently in close proximity to the brand name.'
  },
  {
    ruleCode: 'RULE_6_1_C',
    ruleTitle: 'Net Quantity Declaration in Standard Metric Units',
    actReference: 'Rule 6(1)(c) read with Rule 11 & Rule 12',
    penaltySection: 'Section 18 & Section 36(1) of LM Act, 2009',
    summary: 'Net quantity must be declared in standard international metric units (g, kg, ml, l or L, m, cm, mm, N or U) without illegal plural forms or qualifiers.',
    fullStatutoryText: 'The net quantity, in terms of the standard unit of weight or measure, of the commodity contained in the package or where the commodity is packed or sold by number, the number of the commodity contained in the package shall be mentioned.',
    commonViolations: [
      'Using illegal plural symbols: "gms", "g.", "Kgs", "ML", "ltr", "ltrs"',
      'Using non-standard units: "pieces", "pcs", "nos" instead of "N" or "U"',
      'Adding qualifying words prohibited under Rule 12(2) such as "approx", "min", "when packed"'
    ],
    correctPractice: 'Use strictly standard metric symbols: "g" for gram, "kg" for kilogram, "ml" or "mL" for millilitre, "l" or "L" for litre, "N" or "U" for number.'
  },
  {
    ruleCode: 'RULE_6_1_D',
    ruleTitle: 'Month and Year of Manufacture / Packing / Import',
    actReference: 'Rule 6(1)(d) of LMPC Rules, 2011',
    penaltySection: 'Section 18 & Section 36(1) of LM Act, 2009',
    summary: 'Clear declaration of the month and year in which the commodity is manufactured or pre-packed or imported.',
    fullStatutoryText: 'The month and the year in which the commodity is manufactured or pre-packed or imported shall be mentioned on the package: Provided that for packages containing cosmetics, the words "Best Before" or "Use by" date shall also be mentioned.',
    commonViolations: [
      'Printing only batch number or Julian date code without human-readable month/year',
      'Illegible stamping on bottle crimps or edges',
      'Missing date on pre-packaged outer cartons'
    ],
    correctPractice: 'Declare month and year clearly in numerals or letters: "Mfg Date: 02/2026" or "Pkd: Feb 2026".'
  },
  {
    ruleCode: 'RULE_6_1_E',
    ruleTitle: 'Maximum Retail Price (MRP) & Mandatory Tax Clause',
    actReference: 'Rule 6(1)(e) of LMPC Rules, 2011',
    penaltySection: 'Section 18 read with Section 36(1) & 36(2) of LM Act, 2009',
    summary: 'MRP must be stated in Indian Currency with the words "inclusive of all taxes". Quoting "taxes extra" is strictly prohibited and heavily penalized.',
    fullStatutoryText: 'The retail sale price of the package shall clearly indicate that it is the maximum retail price and include the words "inclusive of all taxes" or "incl. of all taxes", along with the Rupee symbol (₹) or Rs.',
    commonViolations: [
      'Stating "Local Taxes Extra" or "+ Taxes" (Direct violation of Section 36(2))',
      'Dual pricing stickers or overwriting original stamped MRP',
      'Missing "inclusive of all taxes" text next to the amount',
      'Missing currency sign'
    ],
    correctPractice: 'Print as: "MRP ₹ 150.00 (inclusive of all taxes)" or "MRP Rs. 150.00 (incl. of all taxes)".'
  },
  {
    ruleCode: 'RULE_6_10_USP',
    ruleTitle: 'Mandatory Unit Sale Price (USP) (2022 Amendment)',
    actReference: 'Rule 6(10) / Notification G.S.R. 779(E)',
    penaltySection: 'Section 18 & Section 36(1) of LM Act, 2009',
    summary: 'All pre-packaged commodities must declare the Unit Sale Price per gram, per kilogram, per millilitre, per litre, or per number to enable direct price comparison.',
    fullStatutoryText: 'The unit sale price shall be declared on every package where the net quantity is more than one kilogram or one litre in terms of unit sale price per kg or per litre, and where net quantity is less than one kilogram or one litre in terms of per gram or per millilitre, rounded off to two decimal places.',
    commonViolations: [
      'Complete omission of Unit Sale Price on packaged grocery, staples, or FMCG goods',
      'Calculation discrepancy between stated MRP, Net Quantity and declared USP',
      'Using wrong denominator basis (e.g. per 500g instead of per g or per kg)'
    ],
    correctPractice: 'For 250g pack at ₹50: "Unit Sale Price: ₹ 0.20 / g" or "₹ 20.00 / 100g". For 5kg pack at ₹250: "Unit Sale Price: ₹ 50.00 / kg".'
  },
  {
    ruleCode: 'RULE_6_1_F',
    ruleTitle: 'Consumer Care Cell Details',
    actReference: 'Rule 6(1)(f) of LMPC Rules, 2011',
    penaltySection: 'Section 18 & Section 36(1) of LM Act, 2009',
    summary: 'Every package shall bear the name, complete address, telephone number, and email address of the person/office to be contacted for consumer grievances.',
    fullStatutoryText: 'The name, address, telephone number and e-mail address of the person who can be or the office which can be, contacted, in case of consumer complaints, shall be declared on the package.',
    commonViolations: [
      'Missing consumer care email address',
      'Missing consumer care telephone number',
      'Omitting designation of person responsible (e.g. Consumer Care Officer)',
      'Vague statement like "In case of complaint, contact manufacturer"'
    ],
    correctPractice: 'Provide 4 mandatory fields: "Contact: Consumer Care Officer, Address: ..., Tel: 1800-xxx-xxxx, Email: care@domain.com".'
  },
  {
    ruleCode: 'RULE_7_8_PDP',
    ruleTitle: 'Principal Display Panel (PDP) Dimensions & Minimum Font Height',
    actReference: 'Rule 7 & Rule 8, Schedule II of LMPC Rules, 2011',
    penaltySection: 'Rule 32 & Section 36(1) of LM Act, 2009',
    summary: 'Minimum font height of numerals and letters declaring Net Quantity depends on the area of the Principal Display Panel and quantity contained.',
    fullStatutoryText: 'The minimum height of numerals and letters shall be in accordance with Table 1 of Schedule II: Up to 50g/ml: 1.0mm; 50g to 200g/ml: 2.0mm; 200g to 1kg/l: 4.0mm; Above 1kg/l: 6.0mm. Area of PDP for rectangular container is 40% of total area of the side.',
    commonViolations: [
      'Printing microscopic font size for net quantity on large pouches/bottles',
      'Net quantity font height under 4.0 mm on 1 litre or 1 kg packages',
      'Declarations placed on obscure bottom flaps instead of Principal Display Panel'
    ],
    correctPractice: 'Ensure numeral height conforms strictly to Schedule II minimum height thresholds.'
  }
];

export const SCHEDULE_II_FONT_TABLE = [
  {
    netQuantityRange: 'Up to 50 g / 50 ml',
    minFontHeightNormal: '1.0 mm',
    minFontHeightBlownMoulded: '1.5 mm',
    pdpAreaThreshold: 'Up to 50 cm²'
  },
  {
    netQuantityRange: 'Above 50 g / ml up to 200 g / ml',
    minFontHeightNormal: '2.0 mm',
    minFontHeightBlownMoulded: '3.0 mm',
    pdpAreaThreshold: '50 cm² to 100 cm²'
  },
  {
    netQuantityRange: 'Above 200 g / ml up to 1 kg / 1 L',
    minFontHeightNormal: '4.0 mm',
    minFontHeightBlownMoulded: '6.0 mm',
    pdpAreaThreshold: '100 cm² to 500 cm²'
  },
  {
    netQuantityRange: 'Above 1 kg / 1 L',
    minFontHeightNormal: '6.0 mm',
    minFontHeightBlownMoulded: '6.0 mm',
    pdpAreaThreshold: 'Above 500 cm²'
  }
];
