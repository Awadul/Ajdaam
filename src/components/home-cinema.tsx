'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ArrowDown } from 'lucide-react';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { projects } from '@/lib/projects';
import { services } from '@/lib/site';
import { SplitHeading } from '@/components/motion';
import { MediaFrame, PillCTA } from '@/components/ui';

/* ------------------------------------------------------------------ */
/*  Primitives                                                         */
/* ------------------------------------------------------------------ */

/**
 * Magnetic hover. The child leans toward the cursor on a spring and snaps
 * back when it leaves — pointer physics, where everything else on the page
 * is either scroll-scrubbed or time-based. Wrap a CTA, never a paragraph.
 */
export function Magnetic({
  children,
  strength = 0.32,
  className = '',
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A number that counts up once, when it scrolls into view — the page's own
 * facts arriving the way a readout settles.
 */
export function CountUp({
  to,
  prefix = '',
  suffix = '',
  duration = 1.6,
  className = '',
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

/**
 * The scroll coin: circular type turning slowly around a down arrow, sitting
 * on the hero's photo like a maker's stamp. The one time-looping element on
 * the page besides the client ring.
 */
export function SpinBadge({ className = '' }: { className?: string }) {
  const pathId = useId();

  return (
    <div className={className}>
      <div className="relative flex size-28 items-center justify-center rounded-full bg-paper shadow-[0_16px_40px_rgba(15,26,46,0.18)]">
        <div className="spin-slow size-24">
          <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
            <defs>
              <path
                id={pathId}
                d="M 50 50 m -38 0 a 38 38 0 1 1 76 0 a 38 38 0 1 1 -76 0"
              />
            </defs>
            <text
              className="fill-graphite"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '8.2px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              <textPath href={`#${pathId}`}>Sketch to cut · Made to order ·</textPath>
            </text>
          </svg>
        </div>
        <ArrowDown
          className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 text-scribe"
          aria-hidden
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

// The machine actually mid-cut: a live strip of it sits inside the headline,
// and the full frame carries the right column.
const heroShot = projects.find((p) => p.id === 'CNVGtOdH4AW')!;

/**
 * The opening scene. Editorial scale pushed as far as the grid allows: the
 * headline runs the full measure at up to 10rem with the hero footage
 * embedded in it as a pill, the supporting copy and the photo sit on an
 * asymmetric row underneath, and the whole composition parts as you scroll —
 * type drifting up while the footage sinks, so leaving the hero feels like
 * the page opening rather than the page ending.
 */
export function CinemaHero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const typeY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const typeFade = useTransform(scrollYProgress, [0, 0.75], [1, 0.2]);
  const mediaY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  return (
    <section ref={ref} className="mx-auto max-w-[1400px] px-6 pt-10 md:px-10 md:pt-16">
      <motion.h1
        style={reduced ? undefined : { y: typeY, opacity: typeFade }}
        className="display text-[clamp(2.6rem,7.8vw,7.25rem)] leading-[0.88]"
      >
        <SplitHeading text="We design" />
        <br />
        <span className="inline-flex items-center gap-[0.14em]">
          {/* The machine itself, running inside the sentence. */}
          <motion.span
            aria-hidden
            initial={reduced ? undefined : { scale: 0.5, opacity: 0 }}
            animate={reduced ? undefined : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative hidden h-[0.62em] w-[1.55em] overflow-hidden rounded-full bg-hairline/40 md:inline-block"
          >
            <MediaFrame media={heroShot.media[0]} alt="" />
          </motion.span>
          <span className="text-scribe">
            <SplitHeading text="and build" />
          </span>
        </span>
        <br />
        <span className="inline-flex items-baseline gap-[0.14em]">
          <SplitHeading text="products" />
          <span
            aria-hidden
            className="mb-[0.14em] inline-block size-[0.11em] rounded-full bg-scribe shadow-[0_0_24px_rgba(27,79,199,0.7)]"
          />
        </span>
      </motion.h1>

      <div className="mt-10 grid items-start gap-10 md:mt-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <motion.p
            initial={reduced ? undefined : { opacity: 0, y: 20 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-lg leading-relaxed text-graphite"
          >
            You bring a sketch, a photo, or a rough idea. We draw it properly, program it, and{' '}
            <strong className="font-semibold text-ink">cut it in wood, metal or acrylic.</strong>{' '}
            One shop, from the first line to the finished piece.
          </motion.p>

          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 20 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <PillCTA href="/contact">Request a quote</PillCTA>
            </Magnetic>
            <Magnetic strength={0.22}>
              <Link
                href="/work"
                className="tap flex items-center rounded-full border border-hairline px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-scribe hover:text-scribe"
              >
                See the work
              </Link>
            </Magnetic>
          </motion.div>

          <motion.dl
            initial={reduced ? undefined : { opacity: 0, y: 20 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.74, ease: [0.16, 1, 0.3, 1] }}
            className="rule-top mt-10 grid max-w-md grid-cols-3 gap-6 pt-6"
          >
            <div>
              <dt className="display text-2xl text-ink md:text-3xl">
                <CountUp to={projects.length} suffix="+" />
              </dt>
              <dd className="spec mt-1">Projects delivered</dd>
            </div>
            <div>
              <dt className="display text-2xl text-ink md:text-3xl">
                <CountUp to={services.length} />
              </dt>
              <dd className="spec mt-1">Machines in-house</dd>
            </div>
            <div>
              <dt className="display text-2xl text-ink md:text-3xl">±0.1 mm</dt>
              <dd className="spec mt-1">Held tolerance</dd>
            </div>
          </motion.dl>
        </div>

        <div className="relative">
          <motion.div
            initial={reduced ? undefined : { clipPath: 'inset(100% 0% 0% 0% round 24px)' }}
            animate={reduced ? undefined : { clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-4/3 overflow-hidden rounded-3xl bg-hairline/40 shadow-[0_24px_60px_rgba(15,26,46,0.16)] md:aspect-16/11"
          >
            <motion.div
              style={reduced ? undefined : { y: mediaY }}
              className="absolute -inset-y-10 inset-x-0 scale-[1.06]"
            >
              <MediaFrame media={heroShot.media[0]} alt="The fiber laser mid-cut through mild steel" priority />
            </motion.div>
            <div className="absolute inset-0 bg-linear-to-t from-ink-deep/30 via-transparent to-transparent" />
            <span className="spec absolute bottom-4 left-4 rounded-full bg-canvas/90 px-3 py-1.5 text-ink! backdrop-blur">
              Fiber laser · mild steel
            </span>
          </motion.div>

          <SpinBadge className="absolute -bottom-9 -left-6 z-10 hidden lg:flex" />
          <span
            aria-hidden
            className="absolute -bottom-5 -right-5 -z-10 hidden size-40 rounded-3xl bg-scribe-wash lg:block"
          />
        </div>
      </div>
    </section>
  );
}


