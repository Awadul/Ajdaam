'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion';
import { materials, services } from '@/lib/site';
import { projects } from '@/lib/projects';
import { MediaFrame } from '@/components/ui';
import { FlipIn, Tilt3D } from '@/components/home-dimension';

// Project mapping records
const shots: Record<string, string> = {
  'cnc-machining': 'CEzTdoxHx9G',
  'fiber-laser': 'CDZ7hcol16-',
  'plasma-cutting': 'CFeA8cAFLHY',
  'laser-cutting': 'CCllBdMFx2L',
  'wood-carving': 'CFAWzjUnN5n',
  'product-development': 'CNVWBdhHU3s',
};

const materialShots = [
  'CCn_D7hFHJd', // Solid Wood
  'CC37tiKlbss', // MDF
  'CDE-za8lrlx', // Acrylic
  'CDZ7hcol16-', // Mild Steel
  'CBsT1hcllBw', // Aluminium Cladding
  'CIODh5bnghY', // PVC
];

const outputs = [
  {
    name: 'Timber Partition Screen',
    method: 'CNC Machining',
    spec: '18mm MDF',
    note: 'Custom geometric patterns milled across full sheet panels for a retail lobby.',
    projectId: 'CC37tiKlbss',
  },
  {
    name: 'Mild Steel Facade Screens',
    method: 'Fiber Laser Cutting',
    spec: '3mm Steel',
    note: 'Precision profile cut sheet metal cladding for exterior architectural screen walls.',
    projectId: 'CDZ7hcol16-',
  },
  {
    name: 'Heavy Gauge Brackets',
    method: 'Plasma Cutting',
    spec: '12mm Steel',
    note: 'High-current cutting of structural steel components for heavy framing assemblies.',
    projectId: 'CFeA8cAFLHY',
  },
  {
    name: 'Acrylic Brand Signage',
    method: 'Laser Engraving',
    spec: '5mm Acrylic',
    note: 'Flame-polished laser profiles with vector-engraved copy for backlit signs.',
    projectId: 'CDE-za8lrlx',
  },
  {
    name: 'Relief Wall Plaque',
    method: '3D Wood Carving',
    spec: 'Carved Teak',
    note: 'Sculpted topography and patterns, machine rough-cut and hand-finished.',
    projectId: 'CCn_D7hFHJd',
  },
  {
    name: 'Machined Components',
    method: 'Product Development',
    spec: 'Sketch to Part',
    note: 'CAD modeling and production of custom parts from metal sheet stock.',
    projectId: 'CNVWBdhHU3s',
  },
];

/**
 * The workshop console, decluttered to three layers: tabs, a list of names,
 * one photo. Everything the old spec table repeated is gone — each item is
 * a name in the list, a chip and one line on the plate, nothing twice.
 *
 * The scroll-stopper: on desktop the band pins for a few viewport heights
 * and the scroll itself becomes the dial — each turn of the wheel indexes
 * the list forward one item, the way the drum used to step, so a reader
 * can't pass the section without walking through what the shop does.
 * On mobile (and for reduced motion) nothing pins: the section flows and a
 * quiet timer does the indexing instead.
 */
export function WorkshopShowcase() {
  const wrapRef = useRef<HTMLElement>(null);
  const inView = useInView(wrapRef, { margin: '-100px' });
  const reduced = useReducedMotion();

  const [modeIdx, setModeIdx] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [engaged, setEngaged] = useState(false);
  // Hand on the list: the pointer owns the selection and the scroll dial
  // waits, so hover and scroll never fight over the highlight.
  const [handOn, setHandOn] = useState(false);
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsLg(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const modes = [
    {
      id: 'methods',
      label: 'Methods',
      exitHref: '/services',
      exitLabel: 'All services',
      items: services.map((s) => ({
        name: s.name,
        spec: s.spec,
        description: s.summary,
        projectId: shots[s.slug],
        href: `/services#${s.slug}`,
      })),
    },
    {
      id: 'stock',
      label: 'Stock',
      exitHref: '/materials',
      exitLabel: 'All materials',
      items: materials.map((m, idx) => ({
        name: m.name,
        spec: m.spec,
        description: m.note,
        projectId: materialShots[idx],
        href: '/materials',
      })),
    },
    {
      id: 'outputs',
      label: 'Outputs',
      exitHref: '/work',
      exitLabel: 'See the work',
      items: outputs.map((o) => ({
        name: o.name,
        spec: o.spec,
        description: o.note,
        projectId: o.projectId,
        href: '/work',
      })),
    },
  ];

  const currentMode = modes[modeIdx];
  const itemsList = currentMode.items;
  const currentItem = itemsList[activeIdx] || itemsList[0];
  const count = itemsList.length;

  /* Desktop: the scroll is the dial. The pinned wrapper's progress maps to
     the item index; the last 8% is slack so the final item gets a beat
     before the band releases. */
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!isLg || handOn) return;
    const n = Math.min(count - 1, Math.max(0, Math.floor((v / 0.92) * count)));
    setActiveIdx(n);
  });

  /* Mobile: a quiet timer does the indexing. */
  useEffect(() => {
    if (reduced || engaged || !inView || isLg) return;
    const timer = setInterval(() => setActiveIdx((v) => (v + 1) % count), 3400);
    return () => clearInterval(timer);
  }, [reduced, engaged, inView, isLg, count]);

  const selectMode = (idx: number) => {
    setModeIdx(idx);
    setActiveIdx(0);
    setEngaged(true);
  };

  return (
    <section ref={wrapRef} aria-label="Workshop Showcase" className="lg:h-[220vh]">
      <div
        className="overflow-hidden bg-ink-deep py-14 text-canvas md:py-20 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:pb-8 lg:pt-24"
        onMouseEnter={() => setEngaged(true)}
        onMouseLeave={() => setEngaged(false)}
      >
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
          {/* Control header: three tabs, one exit. Nothing else. */}
          <div className="flex flex-wrap items-baseline gap-4 pb-6 md:gap-8">
            {modes.map((m, idx) => {
              const active = modeIdx === idx;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => selectMode(idx)}
                  className="group relative flex items-baseline gap-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-scribe"
                >
                  <span
                    className={`display text-lg uppercase tracking-tight transition-colors duration-300 md:text-xl ${
                      active ? 'text-scribe' : 'text-canvas/60 hover:text-canvas'
                    }`}
                  >
                    {m.label}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="activeModeBar"
                      className="absolute -bottom-6 left-0 right-0 h-0.5 bg-scribe shadow-[0_0_12px_rgba(27,79,199,0.5)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}

            <Link
              href={currentMode.exitHref}
              className="group ml-auto inline-flex items-center gap-2 text-sm font-medium text-canvas/70 transition-colors hover:text-scribe-lift"
            >
              {currentMode.exitLabel}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          <div aria-hidden className="h-px bg-linear-to-r from-transparent via-canvas/15 to-transparent" />

          <div className="mt-7 grid gap-10 lg:mt-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            {/* The list: a name and an arrow, nothing else. Re-dealt when
                the tab changes. */}
            <motion.div
              key={currentMode.id}
              initial={reduced ? false : 'hidden'}
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              style={{ perspective: 900 }}
              onMouseEnter={() => setHandOn(true)}
              onMouseLeave={() => setHandOn(false)}
            >
              {itemsList.map((item, i) => {
                const on = activeIdx === i;
                const project = projects.find((p) => p.id === item.projectId);

                return (
                  <motion.div
                    key={item.name}
                    variants={{
                      hidden: { opacity: 0, y: 18, rotateX: -28 },
                      show: {
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    style={{ transformOrigin: 'center top' }}
                    className="pt-4"
                  >
                    <button
                      type="button"
                      onMouseEnter={() => {
                        setActiveIdx(i);
                        setEngaged(true);
                      }}
                      onClick={() => {
                        setActiveIdx(i);
                        setEngaged(true);
                      }}
                      className="group relative flex w-full items-center gap-4 rounded py-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-scribe md:gap-6"
                    >
                      <motion.span
                        animate={reduced ? undefined : { x: on ? 8 : 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className={`display flex-1 text-[clamp(1.15rem,2.1vw,1.7rem)] transition-colors duration-500 ${
                          on ? 'text-scribe' : 'text-canvas/70 group-hover:text-canvas'
                        }`}
                      >
                        {item.name}
                      </motion.span>

                      <span
                        aria-hidden
                        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-scribe"
                        style={{
                          opacity: on ? 1 : 0,
                          transform: on ? 'scale(1)' : 'scale(0.5)',
                          transition: 'opacity 0.3s ease, transform 0.4s var(--ease-pop)',
                        }}
                      >
                        <ArrowRight className="size-3 text-canvas" />
                      </span>
                    </button>

                    {/* Mobile inline details: a chip, a line, a photo. */}
                    <div className="overflow-hidden lg:hidden">
                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <span className="spec inline-block border border-scribe/40 px-2 py-1 text-scribe!">
                              {item.spec}
                            </span>
                            <p className="mt-3 mb-4 text-sm leading-relaxed text-canvas/70">
                              {item.description}
                            </p>
                            {project && (
                              <div className="relative mb-2 aspect-16/10 w-full overflow-hidden rounded-xl bg-canvas/5">
                                <MediaFrame media={project.media[0]} alt={item.name} />
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div
                      aria-hidden
                      className="mt-4 h-px bg-linear-to-r from-transparent via-canvas/10 to-transparent"
                    />
                  </motion.div>
                );
              })}

              {/* Where the dial is. */}
              <div className="mt-6 flex items-center gap-2">
                {itemsList.map((item, i) => (
                  <button
                    key={item.name}
                    type="button"
                    aria-label={item.name}
                    onClick={() => {
                      setActiveIdx(i);
                      setEngaged(true);
                    }}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      activeIdx === i ? 'w-7 bg-scribe' : 'w-3 bg-canvas/15 hover:bg-scribe/40'
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            {/* The plate: one photo, one chip, one line — and the door to
                the item it's showing. */}
            <FlipIn className="hidden lg:block">
              <Tilt3D max={6} className="h-full" innerClassName="rounded-3xl">
                <Link
                  href={currentItem.href}
                  aria-label={`${currentItem.name} — know more`}
                  className="group/plate relative flex h-full min-h-[380px] flex-col overflow-hidden rounded-3xl bg-ink/40 shadow-[0_24px_56px_rgba(0,0,0,0.45)] backdrop-blur-md"
                >
                  <div className="relative flex-1 overflow-hidden bg-ink/30">
                    {itemsList.map((item, i) => {
                      const proj = projects.find((p) => p.id === item.projectId);
                      // Only the active item and its two neighbours are
                      // mounted, so hidden videos don't keep decoding.
                      const near =
                        i === activeIdx ||
                        i === (activeIdx + 1) % count ||
                        i === (activeIdx - 1 + count) % count;
                      if (!proj || !near) return null;
                      return (
                        <div
                          key={item.name}
                          className="absolute inset-0 transition-opacity duration-700"
                          style={{ opacity: activeIdx === i ? 1 : 0 }}
                        >
                          <MediaFrame media={proj.media[0]} alt={item.name} />
                        </div>
                      );
                    })}
                    <div className="absolute inset-0 bg-linear-to-t from-ink-deep via-ink-deep/10 to-transparent" />
                  </div>

                  <div className="relative bg-ink/80 p-5">
                    <div
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-canvas/15 to-transparent"
                    />
                    <motion.div
                      key={`${modeIdx}-${activeIdx}`}
                      initial={reduced ? undefined : { opacity: 0, y: 12 }}
                      animate={reduced ? undefined : { opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="display text-lg text-canvas">{currentItem.name}</p>
                        <span className="spec shrink-0 border border-scribe/40 px-2 py-1 text-scribe!">
                          {currentItem.spec}
                        </span>
                      </div>
                      <p className="mt-2.5 max-w-md text-sm leading-relaxed text-canvas/70">
                        {currentItem.description}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-canvas/80 transition-colors group-hover/plate:text-scribe-lift">
                        Know more
                        <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/plate:translate-x-1" />
                      </span>
                    </motion.div>
                  </div>
                </Link>
              </Tilt3D>
            </FlipIn>
          </div>
        </div>
      </div>
    </section>
  );
}
