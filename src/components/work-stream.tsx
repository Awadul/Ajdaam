'use client';

import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { projects, type Project } from '@/lib/projects';
import { MediaFrame } from '@/components/ui';

/* ------------------------------------------------------------------ */
/*  The three ways a piece arrives                                     */
/* ------------------------------------------------------------------ */

/** Shards: nine fragments of the photo drift home as the item scrolls in. */
function Shard({
  p,
  k,
  project,
}: {
  p: MotionValue<number>;
  k: number;
  project: Project;
}) {
  const row = Math.floor(k / 3);
  const col = k % 3;
  const jitterX = ((k * 37) % 14) - 7;
  const jitterY = ((k * 53) % 14) - 7;
  const start = 0.02 + ((k * 7) % 5) * 0.025;

  const x = useTransform(p, [start, 0.85], [`${(col - 1) * 30 + jitterX}%`, '0%']);
  const y = useTransform(p, [start, 0.85], [`${(row - 1) * 26 + jitterY}%`, '0%']);
  const rotate = useTransform(p, [start, 0.85], [((k * 97) % 22) - 11, 0]);
  const opacity = useTransform(p, [start, start + 0.18], [0, 1]);

  const cell = 100 / 3;
  const clipPath = `inset(${row * cell}% ${(2 - col) * cell}% ${(2 - row) * cell}% ${col * cell}%)`;

  return (
    <motion.div className="absolute inset-0" style={{ x, y, rotate, opacity, clipPath }}>
      <MediaFrame media={project.media[0]} alt="" />
    </motion.div>
  );
}

/** Slats: four vertical strips slide in from above and below, alternating. */
function Slat({
  p,
  k,
  project,
}: {
  p: MotionValue<number>;
  k: number;
  project: Project;
}) {
  const start = 0.04 + k * 0.06;
  const y = useTransform(p, [start, 0.82], [k % 2 ? '36%' : '-36%', '0%']);
  const opacity = useTransform(p, [start, start + 0.22], [0, 1]);
  const clipPath = `inset(0% ${(3 - k) * 25}% 0% ${k * 25}%)`;

  return (
    <motion.div className="absolute inset-0" style={{ y, opacity, clipPath }}>
      <MediaFrame media={project.media[0]} alt="" />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  One item in the stream                                             */
/* ------------------------------------------------------------------ */

/**
 * One piece of the library. Its own scroll transit drives everything: the
 * photo arrives in fragments (shards, slats, or a deep swing — cycled so
 * the walk keeps changing), the info slides in from the item's outer edge,
 * and a ghost index drifts behind at its own speed. Nothing pins; the
 * reader's scroll is the only clock.
 */
function StreamItem({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.95', 'center 0.5'] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.5 });

  const flip = index % 2 === 1;
  const isVideo = project.media[0].type === 'video';
  // Videos always take the single-element swing; photos cycle the three.
  const variant = isVideo ? 'swing' : (['shards', 'slats', 'swing'] as const)[index % 3];

  // Info arrives from the item's outer edge.
  const infoX = useTransform(p, [0.3, 0.85], [flip ? -40 : 40, 0]);
  const infoOpacity = useTransform(p, [0.3, 0.85], [0, 1]);

  // The ghost index drifts against the scroll — a second speed layer.
  const ghostY = useTransform(p, [0, 1], [70, -40]);
  const ghostOpacity = useTransform(p, [0.05, 0.4], [0, 1]);

  // The swing variant: one element, arriving from depth.
  const swingScale = useTransform(p, [0, 0.85], [1.2, 1]);
  const swingRotate = useTransform(p, [0, 0.85], [flip ? 9 : -9, 0]);
  const swingOpacity = useTransform(p, [0, 0.3], [0, 1]);

  const info = (
    <>
      <p className="spec text-scribe!">
        {String(index + 1).padStart(2, '0')} · {project.category}
      </p>
      <h3 className="display mt-3 text-[clamp(1.4rem,2.8vw,2.3rem)]">{project.title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-graphite">{project.blurb}</p>
      <a
        href={project.permalink}
        target="_blank"
        rel="noreferrer"
        className="group mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-graphite transition-colors hover:text-scribe"
      >
        View the post
        <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </>
  );

  if (reduced) {
    return (
      <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div className={`relative aspect-4/3 overflow-hidden rounded-2xl bg-hairline/40 ${flip ? 'lg:order-2' : ''}`}>
          <MediaFrame media={project.media[0]} alt={project.title} />
        </div>
        <div>{info}</div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      {/* The ghost index, behind everything, on the info side. */}
      <motion.span
        aria-hidden
        style={{ y: ghostY, opacity: ghostOpacity }}
        className={`display pointer-events-none absolute -top-14 -z-10 text-[clamp(5rem,11vw,9rem)] leading-none text-scribe/10 ${
          flip ? 'left-0' : 'right-0'
        }`}
      >
        {String(index + 1).padStart(2, '0')}
      </motion.span>

      <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        {/* The piece, arriving. */}
        <div className={flip ? 'lg:order-2' : ''}>
          {variant === 'swing' ? (
            <motion.div
              style={{
                scale: swingScale,
                rotateY: swingRotate,
                opacity: swingOpacity,
                transformPerspective: 1100,
              }}
              className="relative aspect-4/3 overflow-hidden rounded-2xl bg-hairline/40 shadow-[0_20px_48px_rgba(15,26,46,0.14)]"
            >
              <MediaFrame media={project.media[0]} alt={project.title} />
            </motion.div>
          ) : (
            <div className="relative aspect-4/3" style={{ perspective: 1000 }}>
              {Array.from({ length: variant === 'shards' ? 9 : 4 }, (_, k) =>
                variant === 'shards' ? (
                  <Shard key={k} p={p} k={k} project={project} />
                ) : (
                  <Slat key={k} p={p} k={k} project={project} />
                ),
              )}
            </div>
          )}
        </div>

        {/* The info, sliding in from the outer edge. */}
        <motion.div style={{ x: infoX, opacity: infoOpacity }} className={flip ? 'lg:order-1' : ''}>
          {info}
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  The stream                                                         */
/* ------------------------------------------------------------------ */

/**
 * The library as a walk: every piece in the catalogue, one after another,
 * each assembling itself as the reader's scroll carries it into view —
 * shards, slats and deep swings taking turns so no two neighbours arrive
 * the same way. Info rides the sides, alternating. Less reading, more
 * watching.
 */
export function WorkStream() {
  return (
    <section aria-label="The library" className="mx-auto max-w-[1400px] px-6 md:px-10">
      <div className="space-y-24 md:space-y-36">
        {projects.map((project, i) => (
          <StreamItem key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
