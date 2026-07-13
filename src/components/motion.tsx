'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

/** Scroll triggered reveal. Everything on the site rises through the same easing. */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * The signature element.
 *
 * A hairline that draws itself across the page like a toolpath, with a small
 * square cutter head riding the leading edge. Every section on this site is
 * separated by a cut, not a border. It only fires once, on scroll into view,
 * because a machine does not cut the same line twice.
 */
export function CutLine({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={`rule ${className}`} />;

  return (
    <div className={`relative h-px w-full ${className}`}>
      <motion.div
        className="absolute inset-y-0 left-0 bg-scribe"
        initial={{ width: '0%' }}
        whileInView={{ width: '100%' }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        aria-hidden
        className="absolute top-1/2 size-2 -translate-y-1/2 bg-cut-deep"
        initial={{ left: '0%', opacity: 0 }}
        whileInView={{ left: '100%', opacity: [0, 1, 1, 0] }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

/**
 * Scroll linked parallax.
 *
 * The child drifts against the page as the section passes through the viewport.
 * The inner layer is inset past the top and bottom edges by exactly the travel
 * distance, so the drift never exposes a gap. Children should fill it: an
 * `Image` with `fill`, or anything with `size-full`.
 *
 * Keep the distance modest. The point is that the photograph and the type
 * describing it move at different speeds, not that anything is obviously
 * animating.
 */
export function Parallax({
  children,
  distance = 60,
  className = '',
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  // `relative` is not hardcoded here. Tailwind emits `relative` after
  // `absolute`, so a caller passing `absolute inset-0` would silently lose to
  // it. Callers position this themselves; it only guarantees the clip.
  if (reduced) {
    return <div className={`overflow-hidden ${className}`}>{children}</div>;
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        style={{ y, top: -distance, bottom: -distance }}
        className="absolute inset-x-0"
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Words that arrive one at a time, like a plotter laying down a line. */
export function SplitHeading({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const words = text.split(' ');

  if (reduced) return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
