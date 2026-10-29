export interface Review {
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  text: string;
}

export interface Origin {
  material: string;
  maker: string;
  arrival: string;
}

export type Category = "Outerwear" | "Knitwear" | "Objects" | "Accessories";

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  material: string;
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  tags: string[];
  origin: Origin;
  care: string;
  sustainability: string;
  reviews: Review[];
}

export const CATEGORIES: Category[] = ["Outerwear", "Knitwear", "Objects", "Accessories"];

export const products: Product[] = [
  {
    id: 1,
    name: "Structured Wool Trench",
    category: "Outerwear",
    price: 74900,
    material: "100% Boiled Portuguese Wool",
    description:
      "Cut from structured high-density wool with a dropped shoulder silhouette. Finished with handmade horn buttons and a storm-flap back vent.",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?q=80&w=1400&auto=format&fit=crop",
    ],
    rating: 4.8,
    reviewCount: 126,
    stock: 6,
    tags: ["Bestseller"],
    origin: { material: "Beira, Portugal", maker: "Workshop 01, Lisbon", arrival: "3–5 days" },
    care: "Crafted from 100% boiled organic wool sourced from northern Portugal. Specialty dry clean only. Store on padded hangers away from direct light.",
    sustainability:
      "Wool sourced from regenerative pastures in the Beira region; each trench offsets 8kg of carbon through our reforestation partnership.",
    reviews: [
      { author: "Sofia R.", rating: 5, date: "3 weeks ago", verified: true, text: "The wool is heavier than I expected in the best way. Blocks wind completely and the shoulder holds its shape." },
      { author: "Daniel K.", rating: 5, date: "1 month ago", verified: true, text: "Bought this as a 30th birthday gift to myself. Worth saving up for — the buttons alone feel like a small artwork." },
      { author: "Marta P.", rating: 4, date: "2 months ago", verified: false, text: "Beautiful coat, runs slightly large through the shoulders. Would size down if you're petite." },
    ],
  },
  {
    id: 2,
    name: "Roll-Neck Cashmere",
    category: "Knitwear",
    price: 35900,
    material: "Grade-A Mongolian Cashmere",
    description:
      "Spun from ultra-soft Mongolian fibers with a ribbed hem and relaxed collar drape. Double-ply for structure without added weight.",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1400&auto=format&fit=crop",
    ],
    rating: 4.9,
    reviewCount: 214,
    stock: 11,
    tags: ["Bestseller"],
    origin: { material: "Inner Mongolia", maker: "Workshop 02, Lisbon", arrival: "3–5 days" },
    care: "Grade-A double-ply cashmere. Hand wash cold or dry clean. Dry flat, never on a hanger — cashmere stretches under its own weight.",
    sustainability:
      "Sourced through a single herding cooperative we've worked with since 2018, paid above market rate for fibre length and quality.",
    reviews: [
      { author: "James H.", rating: 5, date: "2 weeks ago", verified: true, text: "Softest thing I own. Fits true to size and hasn't pilled after weekly wear all winter." },
      { author: "Priya N.", rating: 5, date: "5 weeks ago", verified: true, text: "The collar drape is exactly like the photos. Rare for knitwear to actually match the listing." },
    ],
  },
  {
    id: 3,
    name: "Minimalist Ceramic Vessel",
    category: "Objects",
    price: 13900,
    material: "Raw Sandstone Clay",
    description:
      "Hand-thrown on the wheel in Lisbon. Left unglazed on the exterior for a natural, tactile finish that develops a soft patina with handling.",
    images: [
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1400&auto=format&fit=crop",
    ],
    rating: 4.7,
    reviewCount: 58,
    stock: 14,
    tags: ["New"],
    origin: { material: "Sado Estuary", maker: "Workshop 03, Lisbon", arrival: "2–4 days" },
    care: "Raw, unglazed exterior — wipe clean with a damp cloth. Glazed interior is watertight and safe for dried arrangements.",
    sustainability:
      "Clay reclaimed from offcuts of our tableware line; each vessel diverts roughly 400g of waste clay from landfill.",
    reviews: [
      { author: "Aiko T.", rating: 5, date: "1 week ago", verified: true, text: "Heavier and more substantial in person than the photos suggest. Sits beautifully on a shelf." },
      { author: "Noah B.", rating: 4, date: "3 weeks ago", verified: true, text: "Lovely texture, slight variation in the glaze line from the photo, but that's the nature of hand-thrown pieces." },
    ],
  },
  {
    id: 4,
    name: "Asymmetric Wrap Coat",
    category: "Outerwear",
    price: 62900,
    material: "Heavy Wool & Silk Blend",
    description:
      "Off-center closure with hidden brass snap fasteners. Designed for dynamic layering across three seasons.",
    images: [
      "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1400&auto=format&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 47,
    stock: 3,
    tags: [],
    origin: { material: "Beira, Portugal", maker: "Workshop 01, Lisbon", arrival: "3–5 days" },
    care: "Wool and silk blend. Dry clean only. Hang on a wide, padded hanger to preserve the drape of the wrap front.",
    sustainability: "Silk lining is a deadstock remnant from a Porto mill — each coat uses fabric that would otherwise go unsold.",
    reviews: [
      { author: "Lucia F.", rating: 5, date: "1 month ago", verified: true, text: "The asymmetric closure is genuinely clever — sits flat and doesn't gape when you sit down." },
      { author: "Ben O.", rating: 4, date: "6 weeks ago", verified: false, text: "Gorgeous coat. Only wish it came in a warmer weight for proper winter use." },
    ],
  },
  {
    id: 5,
    name: "Hand-Poured Brass Lamp",
    category: "Objects",
    price: 26900,
    material: "Solid Brushed Brass",
    description:
      "Emits a warm ambient glow through a micro-perforated brass shade. Integrated dimmer included, wired for a US/UK/EU plug on request.",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=1400&auto=format&fit=crop",
    ],
    rating: 4.9,
    reviewCount: 89,
    stock: 8,
    tags: ["Bestseller"],
    origin: { material: "Recycled Brass", maker: "Workshop 04, Lisbon", arrival: "4–6 days" },
    care: "Solid brushed brass will darken naturally over time — this patina is expected and can be polished back with a soft brass cloth if preferred.",
    sustainability: "Cast from 85% reclaimed brass offcuts sourced from a Porto foundry, melted and re-poured in small batches.",
    reviews: [
      { author: "Camille D.", rating: 5, date: "4 days ago", verified: true, text: "The light it throws is exactly the warm, low glow shown in the product photos. Dimmer works smoothly." },
      { author: "Rui M.", rating: 5, date: "2 months ago", verified: true, text: "Ordered on a whim — the packaging alone told me this was a different kind of company." },
    ],
  },
  {
    id: 6,
    name: "Ribbed Alpaca Cardigan",
    category: "Knitwear",
    price: 32900,
    material: "Baby Alpaca & Merino Blend",
    description:
      "Lightweight warmth with natural elasticity and textured vertical ribbing. Horn buttons and dropped shoulder seams throughout.",
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1400&auto=format&fit=crop",
    ],
    rating: 4.7,
    reviewCount: 63,
    stock: 9,
    tags: ["New"],
    origin: { material: "Peruvian Highlands", maker: "Workshop 02, Lisbon", arrival: "3–5 days" },
    care: "Baby alpaca and merino blend. Hand wash cold, dry flat. Naturally hypoallergenic and resistant to pilling.",
    sustainability:
      "Alpaca fibre from a fair-trade cooperative in the Peruvian highlands, shorn without harm as part of the animals' natural cycle.",
    reviews: [
      { author: "Hannah W.", rating: 5, date: "2 weeks ago", verified: true, text: "Lighter than my old cashmere cardigan but somehow warmer. The ribbing keeps its shape after washing." },
      { author: "Marco V.", rating: 4, date: "1 month ago", verified: true, text: "Great texture and drape, buttons could sit a touch flatter but doesn't bother me day to day." },
    ],
  },
  {
    id: 7,
    name: "Structured Leather Sling",
    category: "Accessories",
    price: 20900,
    material: "Vegetable-Tanned Leather & Brass",
    description:
      "A compact cross-body cut from a single piece of vegetable-tanned hide, finished with solid brass hardware that ages alongside the leather.",
    images: [
      "https://images.unsplash.com/photo-1585488433963-2e35fb083e52?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=1400&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 34,
    stock: 4,
    tags: ["New"],
    origin: { material: "Alentejo, Portugal", maker: "Workshop 05, Lisbon", arrival: "2–4 days" },
    care: "Vegetable-tanned leather. Condition every six months with a natural balm. Avoid prolonged direct sun to prevent uneven darkening.",
    sustainability: "Hide is a byproduct of the regional dairy industry, tanned locally using bark-based agents rather than chromium.",
    reviews: [
      { author: "Elena S.", rating: 5, date: "10 days ago", verified: true, text: "The leather has already softened beautifully after two weeks of daily use. Strap length is spot on." },
      { author: "Tobias L.", rating: 4, date: "1 month ago", verified: false, text: "Handsome bag, a little smaller than I pictured — fine for essentials, tight for a full day out." },
    ],
  },
];


export interface ArchivalPatternSpec {
  patternBlockId: string;
  fabricWeightGsm: number;
  stitchDensitySpi: number;
  seamAllowanceMm: number;
  grainlineAngleDeg: number;
  yardageMeters: number;
  millOrigin: string;
  lotNumber: string;
  fiberComposition: Array<{ fiber: string; percentage: number }>;
  careSymbols: Array<'hand-wash' | 'do-not-bleach' | 'dry-flat' | 'cool-iron' | 'dry-clean'>;
  gradingMatrixMm: Record<'XS' | 'S' | 'M' | 'L' | 'XL', { chest: number; shoulder: number; length: number; sleeve: number }>;
}

export function getProductLedgerSpec(productId: string | number, category = 'Outerwear'): ArchivalPatternSpec {
  const strId = String(productId);
  const seed = strId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gsm = 240 + (seed % 180);
  return {
    patternBlockId: `PAT-${category.slice(0, 3).toUpperCase()}-${String((seed % 89) + 10).padStart(2, '0')}`,
    fabricWeightGsm: gsm,
    stitchDensitySpi: 12 + (seed % 6),
    seamAllowanceMm: 10 + (seed % 6),
    grainlineAngleDeg: seed % 5 === 0 ? 45 : 0,
    yardageMeters: Number((2.1 + (seed % 18) * 0.1).toFixed(1)),
    millOrigin: seed % 2 === 0 ? 'Biella, Italy — Jacquard Shuttle Loom #04' : 'Wakayama, Japan — Loopwheel Frame #11',
    lotNumber: `ATLR-26-${String(seed).slice(-3).padStart(3, '0')}`,
    fiberComposition: [
      { fiber: 'Virgin Merino Wool', percentage: 78 },
      { fiber: 'Mulberry Silk', percentage: 16 },
      { fiber: 'Cashmere', percentage: 6 },
    ],
    careSymbols: ['do-not-bleach', 'dry-flat', 'cool-iron', 'dry-clean'],
    gradingMatrixMm: {
      XS: { chest: 1040, shoulder: 455, length: 710, sleeve: 615 },
      S: { chest: 1080, shoulder: 470, length: 730, sleeve: 630 },
      M: { chest: 1120, shoulder: 485, length: 750, sleeve: 645 },
      L: { chest: 1160, shoulder: 500, length: 770, sleeve: 660 },
      XL: { chest: 1200, shoulder: 515, length: 790, sleeve: 675 },
    },
  };
}
