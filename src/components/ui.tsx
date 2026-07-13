'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { type MediaItem, type Project } from '@/lib/projects';
import { Parallax } from '@/components/motion';

/**
 * Renders an image or a video from /public/media. If `npm run fetch:assets`
 * has not run, or a signed URL expired before it did, the frame degrades to a
 * cut sheet placeholder rather than a broken image icon.
 */
export function MediaFrame({
  media,
  alt,
  priority = false,
  className = '',
}: {
  media: MediaItem;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-hairline/50 ${className}`}>
        <span className="spec px-4 text-center">Asset not fetched</span>
      </div>
    );
  }

  if (media.type === 'video') {
    if (!mounted) {
      return (
        <div className={`size-full bg-hairline/30 ${className}`}>
          {media.poster && (
            <img src={media.poster} alt={alt} className="size-full object-cover animate-pulse" />
          )}
        </div>
      );
    }

    return (
      <video
        className={`size-full object-cover ${className}`}
        src={media.src}
        poster={media.poster}
        muted
        loop
        playsInline
        autoPlay
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={media.src}
      alt={alt}
      fill
      priority={priority}
      sizes="(max-width: 768px) 100vw, 50vw"
      className={`object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}

/** A project tile. The overlay is what gives a light page contrast over photos. */
export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <a href={project.permalink} target="_blank" rel="noreferrer" className="block">
        <div className="relative aspect-4/5 overflow-hidden bg-hairline/40 shadow-none transition-shadow duration-500 group-hover:shadow-[0_18px_42px_rgba(20,24,31,0.22)]">
          <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
            <Parallax distance={20} className="relative size-full">
              <MediaFrame media={project.media[0]} alt={project.title} />
            </Parallax>
          </div>

          <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/45" />

          {project.media.length > 1 && (
            <Chip className="absolute right-3 top-3">{project.media.length} shots</Chip>
          )}

          <div className="absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="text-sm leading-relaxed text-canvas">{project.blurb}</p>
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-lg font-semibold uppercase leading-none tracking-tight">
            {project.title}
          </h3>
          <span className="spec shrink-0">{project.date}</span>
        </div>
      </a>
    </motion.article>
  );
}

/**
 * The section kicker.
 *
 * Every band on the site opens with one of these, so a reader always knows what
 * they are looking at before they read a word of it. The tick is the accent,
 * and it is the only thing on the page that says "a section begins here".
 */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="spec">{children}</p>;
}

/** A blue badge for a spec, a count, a tag — anything already in the data
 * that deserves to read as a fact rather than a caption. Never body text. */
export function Chip({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`spec inline-flex items-center bg-scribe-wash px-2.5 py-1 text-scribe-deep! ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * The pill CTA. bg-scribe, ink-deep-safe canvas text, a white circle riding
 * the trailing edge with the arrow — the button as a small machined part
 * rather than a flat rectangle. One shape, three sizes, used everywhere
 * something asks the reader to act.
 *
 * The soft blue shadow underneath and the little overshoot on the arrow
 * circle are both lifted from octane8.com's own pill buttons — an ambient
 * glow at rest, and a spring rather than a glide when the cursor lands.
 */
const pillSizes = {
  sm: { pad: 'py-1.5 pl-6 pr-1.5 text-sm gap-2', circle: 'size-7', icon: 'size-3.5' },
  base: { pad: 'py-2 pl-7 pr-2 text-base gap-3', circle: 'size-8', icon: 'size-4' },
  lg: { pad: 'py-2.5 pl-8 pr-2.5 text-lg gap-3', circle: 'size-10', icon: 'size-5' },
};

export function PillCTA({
  href,
  children,
  size = 'base',
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  size?: keyof typeof pillSizes;
  className?: string;
}) {
  const s = pillSizes[size];
  return (
    <Link
      href={href}
      className={`tap group inline-flex items-center rounded-full bg-scribe font-medium text-canvas shadow-[0_14px_34px_rgba(27,79,199,0.28)] transition-[background-color,box-shadow] duration-200 hover:bg-scribe-deep hover:shadow-[0_16px_38px_rgba(27,79,199,0.36)] ${s.pad} ${className}`}
    >
      {children}
      <span
        aria-hidden
        className={`flex shrink-0 items-center justify-center rounded-full bg-canvas transition-transform duration-300 group-hover:scale-110 ${s.circle}`}
        style={{ transitionTimingFunction: 'var(--ease-pop)' }}
      >
        <ArrowRight className={`${s.icon} text-scribe`} />
      </span>
    </Link>
  );
}

export function CallToAction() {
  return (
    <section className="bg-ink-deep text-canvas">
      <div className="section mx-auto max-w-[1400px] px-6 md:px-10">
        <h2 className="display text-[clamp(2.2rem,6vw,5rem)]">
          Have a piece
          <br />
          in mind?
        </h2>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-canvas/60">
          Send us the sketch. We will tell you the material, the method and what it costs before
          anything gets cut.
        </p>
        <PillCTA href="/contact" size="lg" className="mt-10">
          Request a quote
        </PillCTA>
      </div>

      {/* The page signs off at the size of a sheet. The wordmark is cropped by
          the bottom edge, the way a part is cropped by the bed. */}
      <div aria-hidden className="overflow-hidden">
        <p className="display -mb-[0.18em] translate-y-[0.06em] text-center text-[16.5vw] leading-none text-canvas/[0.07]">
          Ajdaam
        </p>
      </div>
    </section>
  );
}
