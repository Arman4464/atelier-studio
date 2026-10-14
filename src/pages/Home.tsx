import { motion } from "motion/react";
import Hero from "../components/home/Hero";
import KeyPieces from "../components/home/KeyPieces";
import Manifesto from "../components/home/Manifesto";
import Testimonials from "../components/home/Testimonials";
import Community from "../components/home/Community";
import FAQSection from "../components/home/FAQSection";
import Newsletter from "../components/home/Newsletter";

export default function Home() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Hero />
      <KeyPieces />
      <Manifesto />
      <Testimonials />
      <Community />
      <FAQSection />
      <Newsletter />
    </motion.div>
  );
}
