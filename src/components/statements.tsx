'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * A hairline that fills as the reader moves down the page, pinned to the top.
 * It is the same gesture as CutLine, stretched across the whole document: the
 * page is one long cut, and this shows how far through it you are.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-scribe"
    />
  );
}
