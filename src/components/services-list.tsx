'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { services } from '@/lib/site';
import { projects } from '@/lib/projects';
import { MediaFrame } from '@/components/ui';

/**
 * The services container.
 *
 * Six full width rows rather than a card grid. Each row states its name twice:
 * once at reading size on the left, once at display size inside a band that
 * only moves while the row is hovered or focused. A still page stays still.
 *
 * The band carries the work between repetitions of the name, so hovering a
 * service shows you what that service produces without leaving the row. On
 * touch, where there is no hover, the band never opens and the row is simply a
 * link, which is the correct behaviour rather than a degraded one.
 */

const shots: Record<string, string> = {
  'cnc-machining': 'CEzTdoxHx9G',
  'fiber-laser': 'CDZ7hcol16-',
  'plasma-cutting': 'CFeA8cAFLHY',
  'laser-cutting': 'CCllBdMFx2L',
  'wood-carving': 'CFAWzjUnN5n',
  'product-development': 'CNVWBdhHU3s',
};

function Band({ name, slug }: { name: string; slug: string }) {
  const project = projects.find((p) => p.id === shots[slug]);
  // Enough repetitions to fill any viewport twice over, since the track
  // translates by exactly half its width.
  const runs = Array.from({ length: 8 });

  return (
    <div className="band-track flex w-max items-center gap-8 pr-8">
      {runs.map((_, i) => (
        <div key={i} className="flex shrink-0 items-center gap-8">
          <span className="display whitespace-nowrap text-[clamp(2.5rem,6vw,5rem)] text-canvas">
            {name}
          </span>
          <span aria-hidden className="size-2 shrink-0 bg-scribe" />
          {project && (
            <span className="relative block h-16 w-24 shrink-0 overflow-hidden md:h-20 md:w-32">
              <MediaFrame media={project.media[0]} alt="" />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function ServicesList() {
  const [open, setOpen] = useState<string | null>(null);
  const reduced = useReducedMotion();

  return (
    <div className="mt-12 border-t border-hairline">
      {services.map((service, i) => {
        const active = open === service.slug;

        return (
          <Link
            key={service.slug}
            href={`/services#${service.slug}`}
            className="band group relative block border-b border-hairline"
            onMouseEnter={() => setOpen(service.slug)}
            onMouseLeave={() => setOpen(null)}
            onFocus={() => setOpen(service.slug)}
            onBlur={() => setOpen(null)}
          >
            {/* The resting row. */}
            <div className="relative z-10 flex items-center gap-6 px-1 py-7 transition-colors duration-500 md:gap-12 md:py-8">
              <span
                className={`spec w-8 shrink-0 transition-colors duration-500 ${
                  active ? 'text-canvas/50!' : 'text-scribe!'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <h3
                className={`font-display text-2xl font-semibold uppercase leading-none tracking-tight transition-colors duration-500 md:text-3xl ${
                  active ? 'text-canvas' : ''
                }`}
              >
                {service.name}
              </h3>

              <p
                className={`ml-auto hidden max-w-sm text-sm leading-relaxed transition-colors duration-500 lg:block ${
                  active ? 'text-canvas/60' : 'text-graphite'
                }`}
              >
                {service.summary}
              </p>

              <span
                aria-hidden
                className={`shrink-0 text-xl transition-all duration-500 group-hover:translate-x-2 ${
                  active ? 'text-canvas' : ''
                }`}
              >
                &rarr;
              </span>
            </div>

            {/* The band. It wipes up from the floor of the row — a clip-path
                reveal, not a fade, so it gets the wipe curve rather than the
                reveal curve everything else on the page uses. */}
            <AnimatePresence>
              {active && !reduced && (
                <motion.div
                  aria-hidden
                  initial={{ clipPath: 'inset(100% 0 0 0)' }}
                  animate={{ clipPath: 'inset(0% 0 0 0)' }}
                  exit={{ clipPath: 'inset(100% 0 0 0)' }}
                  transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute inset-0 z-0 overflow-hidden bg-ink-deep"
                >
                  <div className="flex h-full items-center opacity-30">
                    <Band name={service.name} slug={service.slug} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        );
      })}
    </div>
  );
}
