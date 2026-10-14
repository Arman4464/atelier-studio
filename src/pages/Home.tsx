import { motion } from "motion/react";
import Hero from "../components/home/Hero";
import Marquee from "../components/Marquee";
import KeyPieces from "../components/home/KeyPieces";
import Manifesto from "../components/home/Manifesto";
import Testimonials from "../components/home/Testimonials";
import Community from "../components/home/Community";
import FAQSection from "../components/home/FAQSection";
import Newsletter from "../components/home/Newsletter";

const tickerItems = [
  "EDITION N° 26 // RAW SELVEDGE TEXTILES",
  "MILAN PATTERN CUTTING STUDIO",
  "COMPLIMENTARY WORLDWIDE DISPATCH",
  "SMALL-BATCH NUMBERED RUNS // ZERO DEADSTOCK",
];

export default function Home() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Hero />
      <div className="hairline-b bg-[var(--bg-sub)] py-3 font-ledger text-xs uppercase tracking-widest text-[var(--ink-secondary)]">
        <Marquee items={tickerItems} />
      </div>
      <KeyPieces />
      <Manifesto />
      <Testimonials />
      <Community />
      <FAQSection />
      <Newsletter />
    </motion.div>
  );
}
