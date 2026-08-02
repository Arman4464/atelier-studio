import { motion } from "motion/react";
import Hero from "../components/home/Hero";
import TrustStrip from "../components/home/TrustStrip";
import Marquee from "../components/Marquee";
import KeyPieces from "../components/home/KeyPieces";
import Manifesto from "../components/home/Manifesto";
import Testimonials from "../components/home/Testimonials";
import Community from "../components/home/Community";
import FAQSection from "../components/home/FAQSection";
import Newsletter from "../components/home/Newsletter";

const tickerItems = [
  "Lisbon Craftsmanship",
  "Ethically Sourced Materials",
  "Complimentary Global Delivery",
  "Six Runs a Year, Never More",
];

export default function Home() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Hero />
      <TrustStrip />
      <div className="border-y border-line bg-void-2 py-4 font-display text-sm font-bold uppercase tracking-widest text-ink">
        <Marquee items={tickerItems} />
      </div>
      <KeyPieces />
      <div className="px-1.5">
        <Manifesto />
      </div>
      <Testimonials />
      <Community />
      <FAQSection />
      <Newsletter />
    </motion.div>
  );
}
