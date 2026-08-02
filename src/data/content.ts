export function getAnnouncements(freeShippingLabel: string): string[] {
  return [
    `Complimentary express shipping on orders over ${freeShippingLabel}`,
    "Volume 04 pieces are live now — limited runs",
    "14-day returns, no questions asked",
    "Code WELCOME10 for 10% off your first order",
  ];
}

export function getTrustPoints(freeShippingLabel: string) {
  return [
    {
      title: "Worldwide Shipping",
      desc: `Duties and taxes included on every order over ${freeShippingLabel}.`,
    },
    {
      title: "14-Day Returns",
      desc: "Changed your mind? Send it back within two weeks.",
    },
    {
      title: "Secure Checkout",
      desc: "256-bit encryption on every transaction, always.",
    },
    {
      title: "Small-Batch Made",
      desc: "Six releases a year, hand-finished in Lisbon.",
    },
  ];
}

export function getFaqs(freeShippingLabel: string) {
  return [
    {
      q: "How does sizing run?",
      a: "True to standard editorial sizing — see the sizing chart on any product page for exact measurements. Outerwear runs slightly generous to layer over knitwear; if between sizes, size up.",
    },
    {
      q: "Where are your materials sourced?",
      a: "Wool from regenerative pastures in the Beira region, cashmere from a single Mongolian cooperative, and clay from the Sado estuary. Every product page lists its specific origin.",
    },
    {
      q: "What is your return policy?",
      a: "Fourteen days from delivery, unworn and with tags attached. Start a return from your confirmation email or contact us directly — we cover the label within Portugal and the EU.",
    },
    {
      q: "Do you ship internationally?",
      a: `Yes — worldwide, with duties and taxes included at checkout so there are no surprises at your door. Express delivery is free on orders over ${freeShippingLabel}.`,
    },
    {
      q: "How many pieces do you make per run?",
      a: "Between 80 and 200 units per style, depending on the piece. Once a run sells out it is retired, not restocked — that scarcity is intentional, not a marketing device.",
    },
  ];
}

export const processSteps = [
  { n: "01", title: "Source", desc: "Wool from regenerative Beira pastures, clay from the Sado estuary — chosen before a stitch is cut." },
  { n: "02", title: "Cut & Sew", desc: "Patterns are cut by hand and sewn on our workshop floor by six full-time makers, never outsourced." },
  { n: "03", title: "Finish", desc: "Horn buttons are set, seams are pressed, and every piece is inspected twice before it leaves." },
  { n: "04", title: "Deliver", desc: "Packed in reusable cloth, shipped carbon-neutral, backed by a straightforward 14-day window." },
];

export const workshopGallery = [
  "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1200&auto=format&fit=crop",
];

export const craftStations = [
  { name: "Wool Selection", detail: "Beira Region, Portugal", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop" },
  { name: "Pattern Cutting", detail: "Cut by hand, against the grain", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop" },
  { name: "Brass Casting", detail: "Small batch, hand-poured", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop" },
  { name: "Final Inspection", detail: "Checked twice, always", image: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?q=80&w=800&auto=format&fit=crop" },
];

export const communityShots = [
  { image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop", handle: "@ines.mrq" },
  { image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop", handle: "@thomas.eld" },
  { image: "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?q=80&w=800&auto=format&fit=crop", handle: "@studio.noir" },
  { image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop", handle: "@paularocha_" },
];

export const testimonials = [
  { text: "Four winters in and the trench looks better than the day it arrived. Worth every cent.", author: "Sofia R.", location: "Porto, Portugal", rating: 5, verified: true },
  { text: "The cashmere roll-neck is the softest thing I own, and the fit is genuinely true to size.", author: "James H.", location: "London, UK", rating: 5, verified: true },
  { text: "Ordered the lamp on a whim. The packaging alone told me this was a different kind of company.", author: "Aiko T.", location: "Kyoto, Japan", rating: 4, verified: true },
];
