import { motion } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Footer';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  enter:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      <Navbar />
      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="pt-16"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}
