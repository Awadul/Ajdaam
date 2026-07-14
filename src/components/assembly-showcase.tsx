'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { projects } from '@/lib/projects';
import { type ShowcaseItem } from '@/lib/showcase';
import { Magnetic } from '@/components/home-cinema';
import { PillCTA } from '@/components/ui';

/* ------------------------------------------------------------------ */
/*  One shard of the photograph                                        */
/* ------------------------------------------------------------------ */

const GRID = 3;

/**
 * One ninth of the product photo. Each shard is the full image clipped to
 * its cell, drifted out into space and eased home across most of the pin —
 * a gradual settling, not a snap. Same image, same size: the piece closes
 * without a visible seam.
 */
function Shard({ p, k, src }: { p: MotionValue<number>; k: number; src: string }) {
  const row = Math.floor(k / GRID);
  const col = k % GRID;

  // Modest, deterministic scatter with per-shard timing offsets. The piece
  // is whole by the pin's midpoint — the second half of the scroll belongs
  // to the move aside and the spec sheet.
  const jitterX = ((k * 37) % 16) - 8;
  const jitterY = ((k * 53) % 16) - 8;
  const start = 0.03 + ((k * 7) % 5) * 0.022;

  const x = useTransform(p, [start, 0.5], [`${(col - 1) * 34 + jitterX}%`, '0%']);
  const y = useTransform(p, [start, 0.5], [`${(row - 1) * 30 + jitterY}%`, '0%']);
  const rotate = useTransform(p, [start, 0.5], [((k * 97) % 28) - 14, 0]);
  const z = useTransform(p, [start, 0.5], [((k * 29) % 180) - 90, 0]);

  const cell = 100 / GRID;
  const clipPath = `inset(${row * cell}% ${(GRID - 1 - col) * cell}% ${(GRID - 1 - row) * cell}% ${col * cell}%)`;

  return (
    <motion.div className="absolute inset-0" style={{ x, y, rotate, z, clipPath }}>
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 55vw"
        className="object-cover"
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Progressive info reveal                                            */
/* ------------------------------------------------------------------ */

/** One block of the spec column, easing in over its slice of the scroll. */
function InfoReveal({
  p,
  window: [from, to],
  children,
  className = '',
}: {
  p: MotionValue<number>;
  window: [number, number];
  children: ReactNode;
  className?: string;
}) {
  const opacity = useTransform(p, [from, to], [0, 1]);
  const y = useTransform(p, [from, to], [18, 0]);

  return (
    <motion.div style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  The assembly scene                                                 */
/* ------------------------------------------------------------------ */

/**
 * One product, assembled by the reader, in two acts. Act one: the shards
 * drift together centre-stage — the piece has the whole room while it's
 * being made. Act two: whole, it glides into its left column and the spec
 * sheet steps in from the right, row by row — name, facts, story, ask.
 * Nothing is ever printed over the image, and no instruction line is
 * needed; the response to the first turn of the wheel is the instruction.
 */
export function AssemblyHero({ item }: { item: ShowcaseItem }) {
  const wrapRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsLg(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.6 });

  /* Act one: the piece assembles centre-stage. Act two: whole, it glides
     into its left column and the spec sheet steps in from the right. */
  const pieceScale = useTransform(p, [0, 0.5], [0.94, 1]);
  const shadowOpacity = useTransform(p, [0.2, 0.5], [0, 1]);
  // 42% of the image's own width ≈ the offset from column centre to
  // container centre in the 1.05fr/0.95fr grid.
  const slideX = useTransform(p, [0.52, 0.74], ['42%', '0%']);

  const project = projects.find((pr) => pr.id === item.projectId)!;
  const src = project.media[0].src;

  const facts: [string, string][] = [
    ['Material', item.material],
    ['Method', item.method],
    ['Spec', item.spec],
  ];

  const specSheet = (withMotion: boolean) => {
    const Block = withMotion
      ? InfoReveal
      : ({
          children,
          className = '',
        }: {
          p?: MotionValue<number>;
          window?: [number, number];
          children: ReactNode;
          className?: string;
        }) => <div className={className}>{children}</div>;

    return (
      <div>
        <Block p={p} window={[0.58, 0.72]}>
          <h2 className="display text-[clamp(1.7rem,3.4vw,2.8rem)]">{item.name}</h2>
        </Block>

        <dl className="mt-7">
          {facts.map(([label, value], i) => (
            <Block key={label} p={p} window={[0.64 + i * 0.05, 0.76 + i * 0.05]}>
              <div className="rule-top flex items-baseline justify-between gap-6 py-2.5 lg:py-3.5">
                <dt className="spec">{label}</dt>
                <dd className="text-right text-sm font-medium text-ink">{value}</dd>
              </div>
            </Block>
          ))}
        </dl>

        <Block p={p} window={[0.78, 0.9]}>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-graphite max-lg:line-clamp-3 lg:mt-6 lg:text-base">
            {item.story}
          </p>
        </Block>

        <Block p={p} window={[0.84, 0.96]} className="mt-5 flex flex-wrap items-center gap-4 lg:mt-7">
          <Magnetic>
            <PillCTA href="/contact" size="sm">
              Request a piece like this
            </PillCTA>
          </Magnetic>
          <a
            href={project.permalink}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-graphite transition-colors hover:text-scribe"
          >
            View the post
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Block>
      </div>
    );
  };

  if (reduced) {
    return (
      <section aria-label={item.name} className="mx-auto max-w-[1400px] px-6 py-14 md:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-hairline/40">
            <Image src={src} alt={item.name} fill sizes="100vw" className="object-cover" />
          </div>
          {specSheet(false)}
        </div>
      </section>
    );
  }

  return (
    <section ref={wrapRef} aria-label={item.name} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden py-8">
        <div className="mx-auto grid w-full max-w-[1400px] items-center gap-6 px-6 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* The piece, easing together. */}
          <motion.div
            style={{ scale: pieceScale, x: isLg ? slideX : 0 }}
            className="relative"
            aria-hidden
          >
            <motion.div
              style={{ opacity: shadowOpacity }}
              className="absolute -inset-8 -z-10 rounded-[3rem] bg-scribe-wash blur-3xl"
            />
            <div
              className="relative aspect-4/3 max-h-[32vh] w-full sm:max-h-[42vh] lg:max-h-none"
              style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
            >
              {Array.from({ length: GRID * GRID }, (_, k) => (
                <Shard key={k} p={p} k={k} src={src} />
              ))}
            </div>
          </motion.div>

          {/* The spec sheet, filling in beside it. */}
          {specSheet(true)}
        </div>
      </div>
    </section>
  );
}
