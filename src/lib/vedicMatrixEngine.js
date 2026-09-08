// 22-sruti 5-limit lattice + closed-form transfer / Plomp-Levelt engines.
// Educational model. Not a clinical assay.
// Raga Malkauns is Auduva-Auduva: {Sa, ga2, ma1, dha2, ni2}.
// Re and Pa are strictly varjit. Do not insert 3/2 into the Malkauns ladder.

export const SHRUTI_22_MATRIX = [
  { index: 1,  svara: "Sa",   shruti: "Ksama",     ratioStr: "1/1",     num: 1,   den: 1,   cents: 0.00,    tetDev: 0.00 },
  { index: 2,  svara: "re1",  shruti: "Tivra",     ratioStr: "256/243", num: 256, den: 243, cents: 90.22,   tetDev: -9.78 },
  { index: 3,  svara: "re2",  shruti: "Kumudvati", ratioStr: "16/15",   num: 16,  den: 15,  cents: 111.73,  tetDev: 11.73 },
  { index: 4,  svara: "Re3",  shruti: "Manda",     ratioStr: "10/9",    num: 10,  den: 9,   cents: 182.40,  tetDev: -17.60 },
  { index: 5,  svara: "Re4",  shruti: "Chandovati",ratioStr: "9/8",     num: 9,   den: 8,   cents: 203.91,  tetDev: 3.91 },
  { index: 6,  svara: "ga1",  shruti: "Dayavati",  ratioStr: "32/27",   num: 32,  den: 27,  cents: 294.13,  tetDev: -5.87 },
  { index: 7,  svara: "ga2",  shruti: "Ranjani",   ratioStr: "6/5",     num: 6,   den: 5,   cents: 315.64,  tetDev: 15.64 },
  { index: 8,  svara: "Ga3",  shruti: "Raktika",   ratioStr: "5/4",     num: 5,   den: 4,   cents: 386.31,  tetDev: -13.69 },
  { index: 9,  svara: "Ga4",  shruti: "Raudri",    ratioStr: "81/64",   num: 81,  den: 64,  cents: 407.82,  tetDev: 7.82 },
  { index: 10, svara: "ma1",  shruti: "Krodha",    ratioStr: "4/3",     num: 4,   den: 3,   cents: 498.04,  tetDev: -1.96 },
  { index: 11, svara: "ma2",  shruti: "Vajrika",   ratioStr: "27/20",   num: 27,  den: 20,  cents: 519.55,  tetDev: 19.55 },
  { index: 12, svara: "Ma3",  shruti: "Prasarini", ratioStr: "45/32",   num: 45,  den: 32,  cents: 590.22,  tetDev: -9.78 },
  { index: 13, svara: "Ma4",  shruti: "Priti",     ratioStr: "729/512", num: 729, den: 512, cents: 611.73,  tetDev: 11.73 },
  { index: 14, svara: "Pa",   shruti: "Marjani",   ratioStr: "3/2",     num: 3,   den: 2,   cents: 701.96,  tetDev: 1.96 },
  { index: 15, svara: "dha1", shruti: "Ksiti",     ratioStr: "128/81",  num: 128, den: 81,  cents: 792.18,  tetDev: -7.82 },
  { index: 16, svara: "dha2", shruti: "Rakta",     ratioStr: "8/5",     num: 8,   den: 5,   cents: 813.69,  tetDev: 13.69 },
  { index: 17, svara: "Dha3", shruti: "Sandipini", ratioStr: "5/3",     num: 5,   den: 3,   cents: 884.36,  tetDev: -15.64 },
  { index: 18, svara: "Dha4", shruti: "Alapini",   ratioStr: "27/16",   num: 27,  den: 16,  cents: 905.87,  tetDev: 5.87 },
  { index: 19, svara: "ni1",  shruti: "Madanti",   ratioStr: "16/9",    num: 16,  den: 9,   cents: 996.09,  tetDev: -3.91 },
  { index: 20, svara: "ni2",  shruti: "Rohini",    ratioStr: "9/5",     num: 9,   den: 5,   cents: 1017.60, tetDev: 17.60 },
  { index: 21, svara: "Ni3",  shruti: "Ramya",     ratioStr: "15/8",    num: 15,  den: 8,   cents: 1088.27, tetDev: -11.73 },
  { index: 22, svara: "Ni4",  shruti: "Ugra",      ratioStr: "243/128", num: 243, den: 128, cents: 1109.78, tetDev: 9.78 }
];

export const RAGA_ARCHETYPES = {
  malkauns: {
    id: "VEDIC-MATRIX-MALKAUNS-01",
    name: "Raga Malkauns",
    prahar: "3rd Prahar of Night (00:00 - 03:00)",
    rasa: "Santa & Karuna (Deep Meditative Release)",
    svaraIndices: [1, 7, 10, 16, 20],
    vadi: "ma1 (4/3)",
    samvadi: "Sa (1/1)",
    basePitchHz: 65.41,
    targetLaya: 46,
    defaultS: 15,
    defaultV: 90
  },
  darbari: {
    id: "VEDIC-MATRIX-DARBARI-01",
    name: "Raga Darbari Kanada",
    prahar: "Late Night (22:00 - 01:00)",
    rasa: "Gambhira & Karuna (Grandeur, Somatic Anchoring)",
    svaraIndices: [1, 3, 7, 10, 14, 16, 20],
    vadi: "re2 (16/15)",
    samvadi: "Pa (3/2)",
    basePitchHz: 130.81,
    targetLaya: 60,
    defaultS: 25,
    defaultV: 80
  },
  hamsadhwani: {
    id: "VEDIC-MATRIX-HAMSA-01",
    name: "Raga Hamsadhwani",
    prahar: "Pratah (Dawn 06:00 - 09:00)",
    rasa: "Vira & Hasya (Clarity, Intellectual Energy)",
    svaraIndices: [1, 5, 8, 14, 21],
    vadi: "Sa (1/1)",
    samvadi: "Pa (3/2)",
    basePitchHz: 261.63,
    targetLaya: 72,
    defaultS: 35,
    defaultV: 65
  },
  bhairavi: {
    id: "VEDIC-MATRIX-BHAIRAVI-01",
    name: "Raga Bhairavi",
    prahar: "Pratah Sandhya / Universal Closing",
    rasa: "Karuna & Samarpana (Compassion, All-Receptive)",
    svaraIndices: [1, 3, 7, 10, 14, 16, 20],
    vadi: "ma1 (4/3)",
    samvadi: "Sa (1/1)",
    basePitchHz: 130.81,
    targetLaya: 58,
    defaultS: 65,
    defaultV: 45
  }
};

export function calculateTelemetry(S, V, Laya) {
  const s = Math.max(0, Math.min(100, S));
  const v = Math.max(0, Math.min(100, V));
  const l = Math.max(30, Math.min(180, Laya));
  const rmssd = Math.max(12, 80 - (0.60 * s) + (0.40 * v));
  const cortisol = 8.5 + (0.22 * s);
  const heartRate = 60 + (0.35 * s) - (0.15 * v);
  const cognitiveBandwidth = Math.min(100, Math.max(10, 50 - (0.40 * s) + (0.50 * v)));
  const cardiorespiratoryResonance = Math.exp(-Math.pow(l - 60.0, 2) / (2 * Math.pow(15.0, 2)));
  const fascialPrestress = 25.0 + (0.45 * s) - (0.20 * v);
  const cellularShearStrain = Math.max(0.001, (s * 0.008) / (1.0 + (v * 0.05)));
  return {
    rmssd: Number(rmssd.toFixed(2)),
    cortisol: Number(cortisol.toFixed(2)),
    heartRate: Number(heartRate.toFixed(2)),
    cognitiveBandwidth: Number(cognitiveBandwidth.toFixed(2)),
    cardiorespiratoryResonance: Number(cardiorespiratoryResonance.toFixed(4)),
    fascialPrestress: Number(fascialPrestress.toFixed(2)),
    cellularShearStrain: Number(cellularShearStrain.toFixed(4))
  };
}

export function plompLeveltRoughnessPair(f1, f2) {
  const fMin = Math.min(f1, f2);
  const deltaF = Math.abs(f1 - f2);
  if (deltaF === 0) return 0;
  const s = 0.24 / (0.021 * fMin + 19);
  return Math.exp(-3.5 * s * deltaF) - Math.exp(-5.75 * s * deltaF);
}

export function calculateHarmonicRoughness(fBase1, fBase2, numHarmonics = 8) {
  let totalD = 0;
  let normFactor = 0;
  for (let i = 1; i <= numHarmonics; i++) {
    const a_i = 1.0 / i;
    normFactor += Math.pow(a_i, 2);
    for (let j = 1; j <= numHarmonics; j++) {
      const b_j = 1.0 / j;
      const f1 = fBase1 * i;
      const f2 = fBase2 * j;
      totalD += (a_i * b_j) * plompLeveltRoughnessPair(f1, f2);
    }
  }
  return totalD / normFactor;
}
