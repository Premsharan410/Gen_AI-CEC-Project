/**
 * GenMol AI - Sample Mock Molecules (Phase 1 Demo Dataset)
 * 
 * High-contrast, publication-grade 2D molecular structure representations.
 * Clearly marked as pre-computed demo samples for testing and evaluation.
 */

export const MOCK_GENERATION_METRICS = {
  status: 'success',
  is_demo: true,
  requested_count: 10,
  generated_count: 14,
  valid_count: 11,
  returned_count: 10,
  filter_passed_count: 9,
  duration_seconds: 3.84,
  timestamp: new Date().toISOString(),
  pipeline_info: {
    model: 'Character-level LSTM (PyTorch)',
    vocab_size: 42,
    screening_target: 'EGFR (PDB: 1M17)',
    rdkit_version: '2023.09.5 (Simulated)',
  }
};

export const MOCK_MOLECULES = [
  {
    candidate_id: 'GM-101',
    smiles: 'COc1cc2ncnc(Nc3ccc(F)c(Cl)c3)c2cc1OCCCN1CCOCC1',
    canonical_smiles: 'COc1cc2ncnc(Nc3ccc(F)c(Cl)c3)c2cc1OCCCN1CCOCC1',
    valid: true,
    molecular_weight: 446.90,
    logP: 3.24,
    qed: 0.68,
    hbd: 1,
    hba: 7,
    tpsa: 68.74,
    rotatable_bonds: 7,
    filter_pass: true,
    formula: 'C22H24ClFN4O3',
    scaffold_family: 'Quinazoline derivative (EGFR-like pharmacophore)',
    structure_image: null,
    docking_score: -8.1,
    docking_status: 'Complete (Pre-docked sample)',
    svg_structure: `<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" class="w-full h-full stroke-[#24313D] fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round">
      <!-- Quinazoline Core -->
      <polygon points="60,90 80,78 100,90 100,114 80,126 60,114" class="stroke-[#2864DC] fill-[#2864DC]/10"/>
      <polygon points="100,90 120,78 140,90 140,114 120,126 100,114" class="stroke-[#2864DC] fill-[#2864DC]/10"/>
      <!-- Inner double bonds -->
      <line x1="64" y1="92" x2="78" y2="83" class="stroke-[#2864DC]"/>
      <line x1="100" y1="110" x2="84" y2="122" class="stroke-[#2864DC]"/>
      <line x1="120" y1="83" x2="136" y2="92" class="stroke-[#2864DC]"/>
      <!-- Nitrogen markers -->
      <text x="117" y="123" font-size="11" font-weight="700" class="fill-[#2563EB] font-mono stroke-none" text-anchor="middle">N</text>
      <text x="137" y="87" font-size="11" font-weight="700" class="fill-[#2563EB] font-mono stroke-none" text-anchor="middle">N</text>
      <!-- Aniline Linker -->
      <line x1="140" y1="90" x2="160" y2="78"/>
      <text x="156" y="74" font-size="10" font-weight="600" class="fill-[#2563EB] font-mono stroke-none">NH</text>
      <!-- Substituted Phenyl Ring -->
      <polygon points="175,78 195,66 215,78 215,102 195,114 175,102" class="stroke-[#24313D]"/>
      <line x1="179" y1="81" x2="193" y2="72" class="stroke-[#526477]"/>
      <line x1="211" y1="81" x2="211" y2="99" class="stroke-[#526477]"/>
      <!-- Cl and F substituents -->
      <line x1="215" y1="102" x2="230" y2="111"/>
      <text x="232" y="117" font-size="11" class="fill-[#059669] font-mono stroke-none font-bold">Cl</text>
      <line x1="215" y1="78" x2="230" y2="69"/>
      <text x="232" y="72" font-size="11" class="fill-[#D97706] font-mono stroke-none font-bold">F</text>
      <!-- Morpholino-propoxy chain -->
      <line x1="60" y1="90" x2="45" y2="82"/>
      <text x="36" y="82" font-size="11" font-weight="700" class="fill-[#DC2626] font-mono stroke-none">O</text>
      <line x1="33" y1="82" x2="20" y2="90"/>
      <line x1="20" y1="90" x2="20" y2="108"/>
      <!-- Methoxy -->
      <line x1="60" y1="114" x2="45" y2="122"/>
      <text x="34" y="130" font-size="10" font-weight="600" class="fill-[#DC2626] font-mono stroke-none">OMe</text>
    </svg>`
  },
  {
    candidate_id: 'GM-102',
    smiles: 'CC(C)c1ccc(NC(=O)c2cc(Cl)cc(Cl)c2)cc1',
    canonical_smiles: 'CC(C)c1ccc(NC(=O)c2cc(Cl)cc(Cl)c2)cc1',
    valid: true,
    molecular_weight: 322.23,
    logP: 4.12,
    qed: 0.76,
    hbd: 1,
    hba: 2,
    tpsa: 29.10,
    rotatable_bonds: 3,
    filter_pass: true,
    formula: 'C16H15Cl2NO',
    scaffold_family: 'Dichlorobenzamide biaryl analogue',
    structure_image: null,
    docking_score: -7.4,
    docking_status: 'Complete (Pre-docked sample)',
    svg_structure: `<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" class="w-full h-full stroke-[#24313D] fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round">
      <!-- Left Isopropyl Phenyl -->
      <polygon points="50,90 70,78 90,90 90,114 70,126 50,114" class="stroke-[#24313D]"/>
      <line x1="54" y1="92" x2="68" y2="83" class="stroke-[#526477]"/>
      <line x1="86" y1="92" x2="86" y2="112" class="stroke-[#526477]"/>
      <!-- Isopropyl -->
      <line x1="50" y1="90" x2="32" y2="90"/>
      <line x1="32" y1="90" x2="20" y2="76"/>
      <line x1="32" y1="90" x2="20" y2="104"/>
      <!-- Amide Bond -->
      <line x1="90" y1="90" x2="110" y2="78"/>
      <text x="105" y="74" font-size="10" font-weight="600" class="fill-[#2563EB] font-mono stroke-none">NH</text>
      <line x1="118" y1="78" x2="135" y2="88"/>
      <!-- Carbonyl Oxygen -->
      <line x1="133" y1="88" x2="133" y2="108"/>
      <line x1="137" y1="88" x2="137" y2="108"/>
      <text x="130" y="122" font-size="11" font-weight="700" class="fill-[#DC2626] font-mono stroke-none">O</text>
      <!-- Right Dichlorophenyl Ring -->
      <line x1="135" y1="88" x2="155" y2="76"/>
      <polygon points="155,76 175,64 195,76 195,100 175,112 155,100" class="stroke-[#2864DC] fill-[#2864DC]/10"/>
      <line x1="159" y1="78" x2="173" y2="70" class="stroke-[#2864DC]"/>
      <line x1="191" y1="78" x2="191" y2="98" class="stroke-[#2864DC]"/>
      <!-- Chlorine substituents -->
      <line x1="195" y1="76" x2="212" y2="67"/>
      <text x="215" y="70" font-size="11" class="fill-[#059669] font-mono stroke-none font-bold">Cl</text>
      <line x1="175" y1="112" x2="175" y2="130"/>
      <text x="170" y="142" font-size="11" class="fill-[#059669] font-mono stroke-none font-bold">Cl</text>
    </svg>`
  },
  {
    candidate_id: 'GM-103',
    smiles: 'O=C(Nc1nc2ccccc2s1)c1cc(OC)c(OC)c(OC)c1',
    canonical_smiles: 'COc1cc(C(=O)Nc2nc3ccccc3s2)cc(OC)c1OC',
    valid: true,
    molecular_weight: 344.39,
    logP: 2.85,
    qed: 0.72,
    hbd: 1,
    hba: 5,
    tpsa: 69.83,
    rotatable_bonds: 5,
    filter_pass: true,
    formula: 'C17H16N2O4S',
    scaffold_family: 'Trimethoxybenzamide benzothiazole',
    structure_image: null,
    docking_score: -7.8,
    docking_status: 'Complete (Pre-docked sample)',
    svg_structure: `<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" class="w-full h-full stroke-[#24313D] fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round">
      <!-- Trimethoxyphenyl ring -->
      <polygon points="40,85 58,74 76,85 76,107 58,118 40,107" class="stroke-[#24313D]"/>
      <line x1="44" y1="87" x2="56" y2="80" class="stroke-[#526477]"/>
      <line x1="72" y1="87" x2="72" y2="105" class="stroke-[#526477]"/>
      <!-- 3 Methoxy groups -->
      <line x1="40" y1="85" x2="28" y2="78"/>
      <text x="8" y="77" font-size="10" font-weight="600" class="fill-[#DC2626] font-mono stroke-none">MeO</text>
      <line x1="40" y1="107" x2="28" y2="114"/>
      <text x="8" y="122" font-size="10" font-weight="600" class="fill-[#DC2626] font-mono stroke-none">MeO</text>
      <line x1="58" y1="118" x2="58" y2="132"/>
      <text x="48" y="145" font-size="10" font-weight="600" class="fill-[#DC2626] font-mono stroke-none">OMe</text>
      <!-- Amide linker -->
      <line x1="76" y1="85" x2="94" y2="75"/>
      <line x1="92" y1="75" x2="92" y2="60"/>
      <line x1="96" y1="75" x2="96" y2="60"/>
      <text x="89" y="55" font-size="11" font-weight="700" class="fill-[#DC2626] font-mono stroke-none">O</text>
      <line x1="94" y1="75" x2="112" y2="85"/>
      <text x="105" y="100" font-size="10" font-weight="600" class="fill-[#2563EB] font-mono stroke-none">NH</text>
      <!-- Benzothiazole core -->
      <line x1="120" y1="85" x2="140" y2="85"/>
      <polygon points="140,85 158,74 175,85 168,103 147,103" class="stroke-[#168A83] fill-[#168A83]/10"/>
      <text x="148" y="78" font-size="10" class="fill-[#D97706] font-mono stroke-none font-bold">S</text>
      <text x="160" y="103" font-size="10" font-weight="700" class="fill-[#2563EB] font-mono stroke-none">N</text>
      <!-- Fused Benzene -->
      <polygon points="175,85 195,85 208,98 208,118 195,130 175,130 168,103" class="stroke-[#24313D]"/>
    </svg>`
  },
  {
    candidate_id: 'GM-104',
    smiles: 'Cc1ccc(S(=O)(=O)N2CCC(Nc3ncccc3C#N)CC2)cc1',
    canonical_smiles: 'Cc1ccc(S(=O)(=O)N2CCC(Nc3ncccc3C#N)CC2)cc1',
    valid: true,
    molecular_weight: 356.44,
    logP: 2.15,
    qed: 0.81,
    hbd: 1,
    hba: 5,
    tpsa: 80.62,
    rotatable_bonds: 3,
    filter_pass: true,
    formula: 'C18H20N4O2S',
    scaffold_family: 'Piperidinyl sulfonamide cyanopyridine',
    structure_image: null,
    docking_score: -7.1,
    docking_status: 'Complete (Pre-docked sample)',
    svg_structure: `<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" class="w-full h-full stroke-[#24313D] fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round">
      <!-- Tolyl Group -->
      <line x1="18" y1="90" x2="34" y2="90"/>
      <text x="6" y="93" font-size="10" font-weight="600" class="fill-[#526477] font-mono stroke-none">Me</text>
      <polygon points="34,90 48,78 66,78 76,90 66,102 48,102" class="stroke-[#24313D]"/>
      <!-- Sulfonamide SO2-N -->
      <line x1="76" y1="90" x2="94" y2="90"/>
      <text x="91" y="85" font-size="11" class="fill-[#D97706] font-mono stroke-none font-bold">S</text>
      <line x1="94" y1="80" x2="94" y2="68"/>
      <text x="89" y="66" font-size="10" font-weight="700" class="fill-[#DC2626] font-mono stroke-none">O</text>
      <line x1="94" y1="95" x2="94" y2="108"/>
      <text x="89" y="119" font-size="10" font-weight="700" class="fill-[#DC2626] font-mono stroke-none">O</text>
      <!-- Piperidine ring -->
      <polygon points="108,90 120,74 140,74 150,90 140,106 120,106" class="stroke-[#2864DC] fill-[#2864DC]/10"/>
      <text x="105" y="94" font-size="11" font-weight="700" class="fill-[#2563EB] font-mono stroke-none">N</text>
      <!-- NH Linker -->
      <line x1="150" y1="90" x2="168" y2="90"/>
      <text x="162" y="84" font-size="10" font-weight="600" class="fill-[#2563EB] font-mono stroke-none">NH</text>
      <!-- Cyanopyridine -->
      <polygon points="178,90 190,75 210,75 220,90 210,105 190,105" class="stroke-[#24313D]"/>
      <text x="187" y="103" font-size="10" font-weight="700" class="fill-[#2563EB] font-mono stroke-none">N</text>
      <!-- Nitrile C#N -->
      <line x1="210" y1="75" x2="228" y2="65"/>
      <text x="229" y="64" font-size="10" class="fill-[#168A83] font-mono stroke-none font-bold">CN</text>
    </svg>`
  },
  {
    candidate_id: 'GM-105',
    smiles: 'CCOC(=O)c1c(C)nc2c(cnn2c1C)C1CC1',
    canonical_smiles: 'CCOC(=O)c1c(C)nc2c(cnn2c1C)C1CC1',
    valid: true,
    molecular_weight: 288.35,
    logP: 2.44,
    qed: 0.83,
    hbd: 0,
    hba: 4,
    tpsa: 48.01,
    rotatable_bonds: 3,
    filter_pass: true,
    formula: 'C15H20N4O2',
    scaffold_family: 'Pyrazolopyrimidine cyclopropyl hybrid',
    structure_image: null,
    docking_score: -6.9,
    docking_status: 'Complete (Pre-docked sample)',
    svg_structure: `<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" class="w-full h-full stroke-[#24313D] fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round">
      <!-- Fused Pyrazole + Pyrimidine Core -->
      <polygon points="80,95 95,80 115,85 115,115 95,120" class="stroke-[#2864DC] fill-[#2864DC]/10"/>
      <polygon points="115,85 135,75 155,85 155,115 135,125 115,115" class="stroke-[#168A83] fill-[#168A83]/10"/>
      <!-- Ring nitrogens -->
      <text x="92" y="85" font-size="10" font-weight="700" class="fill-[#2563EB] font-mono stroke-none">N</text>
      <text x="80" y="105" font-size="10" font-weight="700" class="fill-[#2563EB] font-mono stroke-none">N</text>
      <text x="133" y="125" font-size="10" font-weight="700" class="fill-[#2563EB] font-mono stroke-none">N</text>
      <!-- Cyclopropyl ring substituent -->
      <polygon points="155,85 175,70 185,90" class="stroke-[#059669] fill-[#059669]/10"/>
      <!-- Ethyl ester -->
      <line x1="155" y1="115" x2="175" y2="125"/>
      <text x="175" y="120" font-size="10" font-weight="600" class="fill-[#DC2626] font-mono stroke-none">C(=O)OEt</text>
      <!-- Methyl groups -->
      <line x1="95" y1="120" x2="85" y2="135"/>
      <line x1="115" y1="85" x2="115" y2="68"/>
    </svg>`
  },
  {
    candidate_id: 'GM-106',
    smiles: 'O=C(c1ccc(Cl)cc1)N1CCN(c2ccccn2)CC1',
    canonical_smiles: 'O=C(c1ccc(Cl)cc1)N1CCN(c2ccccn2)CC1',
    valid: true,
    molecular_weight: 301.77,
    logP: 2.62,
    qed: 0.85,
    hbd: 0,
    hba: 3,
    tpsa: 35.83,
    rotatable_bonds: 2,
    filter_pass: true,
    formula: 'C16H16ClN3O',
    scaffold_family: 'Arylpiperazine benzamide',
    structure_image: null,
    docking_score: -7.2,
    docking_status: 'Complete (Pre-docked sample)',
    svg_structure: `<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" class="w-full h-full stroke-[#24313D] fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round">
      <!-- 4-Chlorophenyl -->
      <line x1="18" y1="90" x2="34" y2="90"/>
      <text x="8" y="93" font-size="11" class="fill-[#059669] font-mono stroke-none font-bold">Cl</text>
      <polygon points="34,90 48,76 66,76 76,90 66,104 48,104" class="stroke-[#24313D]"/>
      <!-- Carbonyl -->
      <line x1="76" y1="90" x2="94" y2="90"/>
      <line x1="92" y1="90" x2="92" y2="74"/>
      <line x1="96" y1="90" x2="96" y2="74"/>
      <text x="90" y="70" font-size="10" font-weight="700" class="fill-[#DC2626] font-mono stroke-none">O</text>
      <!-- Piperazine ring -->
      <polygon points="106,90 118,74 138,74 150,90 138,106 118,106" class="stroke-[#2864DC] fill-[#2864DC]/10"/>
      <text x="104" y="94" font-size="11" font-weight="700" class="fill-[#2563EB] font-mono stroke-none">N</text>
      <text x="146" y="94" font-size="11" font-weight="700" class="fill-[#2563EB] font-mono stroke-none">N</text>
      <!-- Pyridine ring -->
      <polygon points="158,90 172,76 192,76 204,90 192,104 172,104" class="stroke-[#24313D]"/>
      <text x="187" y="103" font-size="10" font-weight="700" class="fill-[#2563EB] font-mono stroke-none">N</text>
    </svg>`
  },
  {
    candidate_id: 'GM-107',
    smiles: 'Cc1cccc(NC(=O)c2ccc(NC(=O)C3CC3)cc2)c1',
    canonical_smiles: 'Cc1cccc(NC(=O)c2ccc(NC(=O)C3CC3)cc2)c1',
    valid: true,
    molecular_weight: 294.35,
    logP: 2.91,
    qed: 0.77,
    hbd: 2,
    hba: 2,
    tpsa: 58.20,
    rotatable_bonds: 4,
    filter_pass: true,
    formula: 'C18H18N2O2',
    scaffold_family: 'Bis-amide phenylene spacer',
    structure_image: null,
    docking_score: -6.8,
    docking_status: 'Complete (Pre-docked sample)',
    svg_structure: `<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" class="w-full h-full stroke-[#24313D] fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round">
      <polygon points="25,90 35,75 55,75 65,90 55,105 35,105" class="stroke-[#24313D]"/>
      <line x1="25" y1="90" x2="12" y2="90"/>
      <line x1="65" y1="90" x2="80" y2="90"/>
      <text x="74" y="85" font-size="10" font-weight="600" class="fill-[#2563EB] font-mono stroke-none">NH</text>
      <line x1="88" y1="90" x2="104" y2="90"/>
      <polygon points="104,90 114,75 134,75 144,90 134,105 114,105" class="stroke-[#2864DC] fill-[#2864DC]/10"/>
      <line x1="144" y1="90" x2="160" y2="90"/>
      <text x="154" y="85" font-size="10" font-weight="600" class="fill-[#2563EB] font-mono stroke-none">NH</text>
      <line x1="168" y1="90" x2="184" y2="90"/>
      <polygon points="184,90 200,75 210,95" class="stroke-[#059669] fill-[#059669]/10"/>
    </svg>`
  },
  {
    candidate_id: 'GM-108',
    smiles: 'O=S(=O)(c1ccc(F)cc1)N1CCN(Cc2ccccc2)CC1',
    canonical_smiles: 'O=S(=O)(c1ccc(F)cc1)N1CCN(Cc2ccccc2)CC1',
    valid: true,
    molecular_weight: 334.41,
    logP: 2.37,
    qed: 0.79,
    hbd: 0,
    hba: 3,
    tpsa: 45.75,
    rotatable_bonds: 3,
    filter_pass: true,
    formula: 'C17H19FN2O2S',
    scaffold_family: 'Fluorobenzenesulfonyl benzylpiperazine',
    structure_image: null,
    docking_score: -7.0,
    docking_status: 'Complete (Pre-docked sample)',
    svg_structure: `<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" class="w-full h-full stroke-[#24313D] fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round">
      <text x="12" y="93" font-size="11" class="fill-[#D97706] font-mono stroke-none font-bold">F</text>
      <line x1="25" y1="90" x2="40" y2="90"/>
      <polygon points="40,90 52,76 72,76 82,90 72,104 52,104" class="stroke-[#24313D]"/>
      <line x1="82" y1="90" x2="98" y2="90"/>
      <text x="96" y="85" font-size="11" class="fill-[#D97706] font-mono stroke-none font-bold">S</text>
      <polygon points="112,90 124,75 144,75 156,90 144,105 124,105" class="stroke-[#2864DC] fill-[#2864DC]/10"/>
      <line x1="156" y1="90" x2="175" y2="90"/>
      <polygon points="175,90 187,76 207,76 217,90 207,104 187,104" class="stroke-[#24313D]"/>
    </svg>`
  },
  {
    candidate_id: 'GM-109',
    smiles: 'COc1ccc(NC(=O)c2cc(C)on2)cc1NC(=O)C1CC1',
    canonical_smiles: 'COc1ccc(NC(=O)c2cc(C)on2)cc1NC(=O)C1CC1',
    valid: true,
    molecular_weight: 315.33,
    logP: 1.88,
    qed: 0.69,
    hbd: 2,
    hba: 5,
    tpsa: 84.46,
    rotatable_bonds: 5,
    filter_pass: true,
    formula: 'C16H17N3O4',
    scaffold_family: 'Isoxazole carboxamide aniline',
    structure_image: null,
    docking_score: -6.5,
    docking_status: 'Complete (Pre-docked sample)',
    svg_structure: `<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" class="w-full h-full stroke-[#24313D] fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round">
      <polygon points="30,85 45,70 60,80 55,100 35,98" class="stroke-[#168A83] fill-[#168A83]/10"/>
      <text x="42" y="75" font-size="10" font-weight="700" class="fill-[#DC2626] font-mono stroke-none">O</text>
      <text x="54" y="93" font-size="10" font-weight="700" class="fill-[#2563EB] font-mono stroke-none">N</text>
      <line x1="60" y1="80" x2="80" y2="80"/>
      <text x="76" y="74" font-size="10" font-weight="600" class="fill-[#2563EB] font-mono stroke-none">NH</text>
      <polygon points="90,80 105,65 125,65 135,80 125,95 105,95" class="stroke-[#24313D]"/>
      <line x1="135" y1="80" x2="155" y2="80"/>
      <text x="158" y="85" font-size="10" font-weight="600" class="fill-[#DC2626] font-mono stroke-none">OMe</text>
      <line x1="125" y1="95" x2="135" y2="110"/>
      <polygon points="135,110 150,125 130,135" class="stroke-[#059669] fill-[#059669]/10"/>
    </svg>`
  },
  {
    candidate_id: 'GM-110',
    smiles: 'O=C(c1ccccc1)N1CCC(c2nnc(-c3cccnc3)o2)CC1',
    canonical_smiles: 'O=C(c1ccccc1)N1CCC(c2nnc(-c3cccnc3)o2)CC1',
    valid: true,
    molecular_weight: 334.38,
    logP: 2.19,
    qed: 0.74,
    hbd: 0,
    hba: 5,
    tpsa: 69.21,
    rotatable_bonds: 3,
    filter_pass: true,
    formula: 'C19H18N4O2',
    scaffold_family: 'Oxadiazole linked pyridine piperidine',
    structure_image: null,
    docking_score: -7.5,
    docking_status: 'Complete (Pre-docked sample)',
    svg_structure: `<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" class="w-full h-full stroke-[#24313D] fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round">
      <polygon points="25,90 38,76 58,76 68,90 58,104 38,104" class="stroke-[#24313D]"/>
      <line x1="68" y1="90" x2="88" y2="90"/>
      <polygon points="98,90 110,75 130,75 142,90 130,105 110,105" class="stroke-[#2864DC] fill-[#2864DC]/10"/>
      <line x1="142" y1="90" x2="160" y2="90"/>
      <polygon points="160,90 172,75 188,85 184,102 166,100" class="stroke-[#168A83] fill-[#168A83]/10"/>
      <text x="170" y="80" font-size="10" font-weight="700" class="fill-[#DC2626] font-mono stroke-none">O</text>
      <line x1="188" y1="85" x2="204" y2="85"/>
      <polygon points="204,85 214,72 230,72 238,85 230,98 214,98" class="stroke-[#24313D]"/>
    </svg>`
  }
];

export function filterMockMolecules(settings) {
  const { num_molecules = 10, enable_filters = true, filters = {} } = settings;
  const {
    min_molecular_weight = 150,
    max_molecular_weight = 500,
    min_logP = -1,
    max_logP = 5,
    min_qed = 0.3,
  } = filters;

  let candidates = MOCK_MOLECULES.map(mol => {
    let pass = true;
    if (enable_filters) {
      if (mol.molecular_weight < min_molecular_weight || mol.molecular_weight > max_molecular_weight) pass = false;
      if (mol.logP < min_logP || mol.logP > max_logP) pass = false;
      if (mol.qed < min_qed) pass = false;
    }
    return {
      ...mol,
      filter_pass: pass,
    };
  });

  const passing = candidates.filter(c => c.filter_pass);
  const returned = passing.slice(0, num_molecules);

  return {
    status: 'success',
    is_demo: true,
    requested_count: Number(num_molecules),
    generated_count: MOCK_MOLECULES.length + 3,
    valid_count: MOCK_MOLECULES.length,
    returned_count: returned.length,
    filter_passed_count: passing.length,
    duration_seconds: parseFloat((2.5 + Math.random() * 1.8).toFixed(2)),
    molecules: returned,
  };
}
