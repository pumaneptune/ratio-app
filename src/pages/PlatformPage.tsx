import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import HowItWorks from '../components/HowItWorks';
import CodeExamples from '../components/CodeExamples';
import NeutralEvaluator from '../components/NeutralEvaluator';
import Pricing from '../components/Pricing';
import BuiltFor from '../components/BuiltFor';
import QuickTest from '../components/QuickTest';
import DocsCTA from '../components/DocsCTA';
import Footer from '../components/Footer';
import PageLayout from '../components/layout/PageLayout';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <Navbar />
      <motion.main variants={pageVariants} initial="initial" animate="enter" exit="exit">
        <QuickTest />
        <HowItWorks />
        <CodeExamples />
        <NeutralEvaluator />
        <Pricing />
        <BuiltFor />
        <DocsCTA />
      </motion.main>
      <Footer />
    </div>
  );
}
