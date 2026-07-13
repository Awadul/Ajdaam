'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { capabilities, caseStudies, certifications, clients, site } from '@/lib/site';
import { projects } from '@/lib/projects';
import { Reveal } from '@/components/motion';
import { MediaFrame, PillCTA } from '@/components/ui';
import { Magnetic } from '@/components/home-cinema';

/* ------------------------------------------------------------------ */
/*  3D primitives                                                      */
/* ------------------------------------------------------------------ */

/**
 * A card that stands in real perspective and tilts toward the cursor on a
 * spring, with a light glare tracking the pointer across its face. Children
 * can carry `translateZ` transforms to float above the surface — keep the
 * tilting element itself overflow-visible or the depth flattens.
 */
export function Tilt3D({
  children,
  max = 9,
  className = '',
  innerClassName = '',
  glare = true,
}: {
  children: ReactNode;
  max?: number;
  className?: string;
  innerClassName?: string;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hover = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), {
    stiffness: 180,
    damping: 20,
    mass: 0.4,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), {
    stiffness: 180,
    damping: 20,
    mass: 0.4,
  });

  const glareX = useTransform(px, [0, 1], [15, 85]);
  const glareY = useTransform(py, [0, 1], [10, 90]);
  const glareImage = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.32), transparent 55%)`;
  const glareOpacity = useSpring(hover, { stiffness: 160, damping: 24 });

  if (reduced) {
    return (
      <div className={className}>
        <div className={`relative h-full ${innerClassName}`}>{children}</div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective: 1000 }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        px.set((e.clientX - rect.left) / rect.width);
        py.set((e.clientY - rect.top) / rect.height);
        hover.set(1);
      }}
      onMouseLeave={() => {
        px.set(0.5);
        py.set(0.5);
        hover.set(0);
      }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`relative h-full ${innerClassName}`}
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: glareImage, opacity: glareOpacity }}
          />
        )}
      </motion.div>
    </div>
  );
}

/**
 * A sheet tipping upright into place — the entrance every card and row in
 * the lower page shares, in 3D where the hero's reveals were flat rises.
 */
export function FlipIn({
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
    <div className={className} style={{ perspective: 900 }}>
      <motion.div
        initial={reduced ? undefined : { opacity: 0, rotateX: -50, y: 28 }}
        whileInView={reduced ? undefined : { opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'center top', transformStyle: 'preserve-3d' }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Client orbit — "Trusted by teams building…"                        */
/* ------------------------------------------------------------------ */

/**
 * The client roster as a carousel in real space: six names on a slowly
 * turning ring, the way samples hang on a finishing rack. The ring pauses
 * when the cursor lands on it.
 */
export function ClientOrbit() {
  const reduced = useReducedMotion();
  const step = 360 / clients.length;

  return (
    <section aria-label="Clients" className="overflow-hidden">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-6 py-12 md:px-10 md:py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <h2 className="display max-w-md text-[clamp(1.4rem,2.8vw,2.4rem)]">
            Trusted by teams building retail, hospitality and commercial spaces
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-graphite">
            Fit-out contractors, signage partners, furniture brands and developers — the people who
            send a drawing on Monday and need the piece on site by Friday.
          </p>
        </Reveal>

        {reduced ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
            {clients.map((client) => (
              <div key={client.name} className="text-center">
                <p className="font-display text-lg leading-tight text-ink/80">{client.name}</p>
                <p className="spec mt-1 text-[0.6rem]! text-graphite/60">{client.sector}</p>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="flex justify-center max-sm:scale-[0.82]"
            style={{ perspective: 1100 }}
          >
            <div className="orbit-y preserve-3d relative h-44 w-64">
              {clients.map((client, i) => (
                <div
                  key={client.name}
                  className="backface-hidden absolute inset-0 flex flex-col items-center justify-center text-center"
                  style={{ transform: `rotateY(${i * step}deg) translateZ(190px)` }}
                >
                  <p className="font-display text-xl leading-tight text-ink/80 md:text-2xl">
                    {client.name}
                  </p>
                  <p className="spec mt-1.5 text-[0.6rem]! text-graphite/60">{client.sector}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  One roof — the statement interlude                                 */
/* ------------------------------------------------------------------ */

const shopShot = projects.find((p) => p.id === 'CCrG1dnFetH')!;

const statement = 'Every machine, every finish, one roof.'.split(' ');

/** One word of the statement, inking in over its slice of the scroll. */
function FillWord({
  progress,
  index,
  total,
  accent,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  accent: boolean;
  children: ReactNode;
}) {
  const opacity = useTransform(progress, [index / total, (index + 1) / total], [0.14, 1]);

  return (
    <>
      <motion.span
        style={{ opacity }}
        className={`inline-block ${accent ? 'text-scribe' : ''}`}
      >
        {children}
      </motion.span>{' '}
    </>
  );
}

/**
 * Why Ajdaam, as a light interlude between the dark console and the spec
 * deck — no longer a second dark band the eye slides past. The claim is set
 * at display scale and inks itself in word by word as the reader scrolls
 * (the page responds to being read), with the shop photo standing beside it
 * as a single tilt card. The placeholder quotes are gone; they can return
 * as real cards when real clients have said real things.
 */
export function AuthorityPanorama() {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.35'],
  });

  return (
    <section className="section mx-auto max-w-[1400px] px-6 md:px-10">
      <h2 ref={ref} className="display max-w-5xl text-[clamp(1.9rem,5vw,3.8rem)]">
        {reduced
          ? statement.join(' ')
          : statement.map((word, i) => (
              <FillWord
                key={i}
                progress={scrollYProgress}
                index={i}
                total={statement.length}
                accent={i >= statement.length - 2}
              >
                {word}
              </FillWord>
            ))}
      </h2>

      <div className="mt-10 grid items-center gap-10 md:mt-14 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="max-w-xl text-base leading-relaxed text-graphite md:text-lg">
            No job leaves this shop to be finished somewhere else. The people who program the cut
            are the people who stand at the bed when it runs, and have since {site.founded}.
          </p>
          <Magnetic>
            <PillCTA href="/process" className="mt-7">
              See the process
            </PillCTA>
          </Magnetic>
        </Reveal>

        <FlipIn>
          <Tilt3D max={7} innerClassName="rounded-3xl">
            <div className="relative aspect-16/10 overflow-hidden rounded-3xl bg-hairline/40 shadow-[0_24px_56px_rgba(15,26,46,0.18)]">
              <MediaFrame media={shopShot.media[0]} alt={shopShot.title} />
              <div className="absolute inset-0 bg-linear-to-t from-ink-deep/60 via-transparent to-transparent" />
              <p className="spec absolute bottom-4 left-4 rounded-full bg-canvas/90 px-3 py-1.5 text-ink! backdrop-blur">
                {shopShot.title}
              </p>
            </div>
          </Tilt3D>
        </FlipIn>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Capability readout                                                 */
/* ------------------------------------------------------------------ */

/**
 * One character of a readout value. Digits roll into place like an
 * odometer — each runs through a short strip of numerals and settles on
 * its target; everything else (×, ±, letters) stands still.
 */
function RollingChar({ char, delay }: { char: string; delay: number }) {
  if (!/\d/.test(char)) {
    return <span className="inline-block">{char === ' ' ? ' ' : char}</span>;
  }

  const target = parseInt(char, 10);
  const strip = [(target + 4) % 10, (target + 8) % 10, (target + 2) % 10, target];

  return (
    <span className="inline-block h-[1em] overflow-hidden align-baseline">
      <motion.span
        className="block"
        initial={{ y: 0 }}
        whileInView={{ y: `-${strip.length - 1}em` }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {strip.map((n, i) => (
          <span key={i} className="block h-[1em] leading-[1]">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/** A value whose digits settle like a machine's position readout. */
function ReadoutValue({ value, reduced }: { value: string; reduced: boolean }) {
  if (reduced) return <>{value}</>;

  return (
    <span className="inline-flex leading-[1]">
      {value.split('').map((char, i) => (
        <RollingChar key={i} char={char} delay={i * 0.045} />
      ))}
    </span>
  );
}

/**
 * The spec sheet as a machine readout: a dark control-panel band where the
 * six figures a buyer scans roll into place like DRO digits when the panel
 * scrolls into view. Ruled instrument rows, not cards — the numbers are
 * the interface.
 */
export function CapabilityDeck() {
  const reduced = useReducedMotion();

  return (
    <section className="bg-ink-deep text-canvas">
      <div className="section mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="display max-w-2xl text-[clamp(1.6rem,3.6vw,3rem)]">
                The numbers, before the drawing
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-canvas/55">
              Everything under one roof, held to a spec you can write into a purchase order.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((cap, i) => (
            <FlipIn key={cap.label} delay={(i % 3) * 0.08}>
              <div className="rule-top-dark flex h-full flex-col py-6">
                <span className="spec text-canvas/45!">{cap.label}</span>
                <span className="display mt-4 text-3xl text-scribe-lift [text-shadow:0_0_22px_rgba(27,79,199,0.45)] md:text-4xl">
                  <ReadoutValue value={cap.value} reduced={!!reduced} />
                </span>
                <span className="mt-4 text-sm leading-relaxed text-canvas/55">{cap.note}</span>
              </div>
            </FlipIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Case deck                                                          */
/* ------------------------------------------------------------------ */

/**
 * Case studies as an expanding strip: three photos share one row, and the
 * one under the cursor breathes open while the others narrow to a spine —
 * the photo does the talking, and the only words left are the sector, the
 * title and the result. The full brief → decision → outcome story lives on
 * the work page; here it's one line: what the client got.
 */
export function CaseDeck() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: '-100px' });
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const reduced = useReducedMotion();

  // The strip walks itself while it's on screen, like the console above;
  // a hand on it takes over.
  useEffect(() => {
    if (reduced || held || !inView) return;
    const timer = setInterval(() => setActive((v) => (v + 1) % caseStudies.length), 4000);
    return () => clearInterval(timer);
  }, [reduced, held, inView]);

  return (
    <section ref={ref} className="section mx-auto max-w-[1400px] px-6 md:px-10">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="display max-w-2xl text-[clamp(1.6rem,3.6vw,3rem)]">
              Briefs, solved end to end
            </h2>
          </div>
          <Link
            href="/work"
            className="group inline-flex items-center gap-3 font-medium text-scribe underline-offset-8 hover:underline"
          >
            See all work
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </Reveal>

      {reduced ? (
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {caseStudies.map((study) => {
            const project = projects.find((p) => p.id === study.id);
            return (
              <article key={study.id} className="overflow-hidden rounded-3xl bg-ink-deep">
                <div className="relative aspect-4/3">
                  {project && <MediaFrame media={project.media[0]} alt={study.title} />}
                </div>
                <div className="p-5">
                  <span className="spec text-scribe!">{study.sector}</span>
                  <h3 className="display mt-2 text-xl text-canvas">{study.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-canvas/70">{study.result}</p>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <Reveal delay={0.05}>
          <div
            className="mt-10 flex h-[560px] flex-col gap-3 md:h-[440px] md:flex-row"
            onMouseEnter={() => setHeld(true)}
            onMouseLeave={() => setHeld(false)}
          >
            {caseStudies.map((study, i) => {
              const project = projects.find((p) => p.id === study.id);
              const on = active === i;

              return (
                <motion.div
                  key={study.id}
                  animate={{ flexGrow: on ? 2.8 : 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  tabIndex={0}
                  className="group relative min-w-0 flex-1 basis-0 cursor-pointer overflow-hidden rounded-3xl bg-ink-deep outline-none focus-visible:ring-2 focus-visible:ring-scribe"
                >
                  <div className="absolute inset-0">
                    {project && <MediaFrame media={project.media[0]} alt={study.title} />}
                  </div>

                  {/* Closed panels sit back in shadow; the open one comes
                      forward into the light. */}
                  <div
                    className={`absolute inset-0 transition-colors duration-700 ${
                      on ? 'bg-ink-deep/15' : 'bg-ink-deep/60'
                    }`}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-ink-deep/90 via-ink-deep/30 to-transparent" />

                  {/* The index, always on. */}
                  <span className="display absolute left-5 top-5 text-2xl text-canvas/45">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Closed: just the sector, set on its side like a spine. */}
                  <motion.span
                    animate={{ opacity: on ? 0 : 1 }}
                    transition={{ duration: 0.35 }}
                    className="spec pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-canvas/80! [writing-mode:vertical-rl] md:block"
                  >
                    {study.sector}
                  </motion.span>
                  <motion.span
                    animate={{ opacity: on ? 0 : 1 }}
                    transition={{ duration: 0.35 }}
                    className="spec pointer-events-none absolute bottom-5 left-5 text-canvas/80! md:hidden"
                  >
                    {study.sector}
                  </motion.span>

                  {/* Open: sector, title, and the one line that matters. */}
                  <motion.div
                    animate={{ opacity: on ? 1 : 0, y: on ? 0 : 18 }}
                    transition={{ duration: 0.5, delay: on ? 0.15 : 0, ease: [0.16, 1, 0.3, 1] }}
                    className="pointer-events-none absolute inset-x-0 bottom-0 p-5 md:p-7"
                  >
                    <span className="spec border border-scribe/40 bg-ink-deep/60 px-2.5 py-1 text-scribe! backdrop-blur">
                      {study.sector}
                    </span>
                    <h3 className="display mt-4 max-w-md text-xl text-canvas md:text-2xl">
                      {study.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-canvas/80">
                      {study.result}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </Reveal>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Standards                                                          */
/* ------------------------------------------------------------------ */

/**
 * The standards rows, tipping into place one after another on the dark
 * band — the audit trail filed sheet by sheet.
 */
export function StandardsFlip() {
  return (
    <section className="bg-ink-deep text-canvas">
      <div className="section mx-auto max-w-[1400px] px-6 md:px-10">
        <h2 className="display text-[clamp(1.6rem,3.6vw,3rem)]">Built to be audited</h2>

        <div className="mt-10 grid gap-x-12 md:grid-cols-2">
          {certifications.map((cert, i) => (
            <FlipIn key={cert.name} delay={(i % 2) * 0.08}>
              <div className="rule-top-dark py-6">
                <h3 className="font-display text-xl leading-tight text-canvas md:text-2xl">
                  {cert.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-canvas/60">{cert.detail}</p>
              </div>
            </FlipIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Wire scene + closing CTA                                           */
/* ------------------------------------------------------------------ */

/**
 * The one true 3D scene: a machined wireframe coil turning slowly in the
 * dark behind the closing ask, leaning with the cursor. three.js, loaded
 * only when the band is near the viewport, torn down when it unmounts.
 * If WebGL or the module fails, the band simply stays dark — the CTA never
 * depends on it.
 */
function WireScene({ className = '' }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Desktop only: phones never pay for a WebGL context they can barely
    // see behind the text gradient.
    if (reduced || !window.matchMedia('(min-width: 1024px)').matches) return;
    const el = mountRef.current;
    if (!el) return;

    let disposed = false;
    let frame = 0;
    let running = false;
    let cleanup: (() => void) | undefined;

    import('three')
      .then((THREE) => {
        if (disposed || !el) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          45,
          el.clientWidth / Math.max(el.clientHeight, 1),
          0.1,
          100,
        );
        camera.position.z = 7;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(el.clientWidth, el.clientHeight);
        el.appendChild(renderer.domElement);

        const geometry = new THREE.TorusKnotGeometry(1.9, 0.5, 160, 20);
        const material = new THREE.MeshBasicMaterial({
          color: 0x1b4fc7,
          wireframe: true,
          transparent: true,
          opacity: 0.28,
        });
        const coil = new THREE.Mesh(geometry, material);
        scene.add(coil);

        let mouseX = 0;
        let mouseY = 0;
        const onMove = (e: MouseEvent) => {
          mouseX = e.clientX / window.innerWidth - 0.5;
          mouseY = e.clientY / window.innerHeight - 0.5;
        };
        window.addEventListener('mousemove', onMove, { passive: true });

        const onResize = () => {
          camera.aspect = el.clientWidth / Math.max(el.clientHeight, 1);
          camera.updateProjectionMatrix();
          renderer.setSize(el.clientWidth, el.clientHeight);
        };
        window.addEventListener('resize', onResize);

        const tick = () => {
          coil.rotation.y += 0.0032;
          coil.rotation.x += 0.0012;
          camera.position.x += (mouseX * 1.4 - camera.position.x) * 0.05;
          camera.position.y += (-mouseY * 1.0 - camera.position.y) * 0.05;
          camera.lookAt(0, 0, 0);
          renderer.render(scene, camera);
          frame = requestAnimationFrame(tick);
        };

        // Only spin while the band is actually on screen.
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting && !running) {
            running = true;
            tick();
          } else if (!entry.isIntersecting && running) {
            running = false;
            cancelAnimationFrame(frame);
          }
        });
        observer.observe(el);

        cleanup = () => {
          observer.disconnect();
          cancelAnimationFrame(frame);
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('resize', onResize);
          geometry.dispose();
          material.dispose();
          renderer.dispose();
          if (renderer.domElement.parentElement === el) el.removeChild(renderer.domElement);
        };
      })
      .catch(() => {
        /* No WebGL, no module — the band stays a plain dark surface. */
      });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [reduced]);

  return <div ref={mountRef} aria-hidden className={className} />;
}

/**
 * The closing ask, with the wire coil turning behind it. Home-page only —
 * the other pages keep the plain CallToAction.
 */
export function CtaDimension() {
  return (
    <section className="relative overflow-hidden bg-ink-deep text-canvas">
      {/* The coil dissolves before it reaches any edge of the band — masked
          top and bottom so it never gets sliced against the footer or the
          section above. */}
      <WireScene className="absolute inset-y-0 right-0 hidden [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_72%,transparent)] lg:left-1/3 lg:block lg:w-2/3" />
      <div aria-hidden className="absolute inset-0 bg-linear-to-r from-ink-deep via-ink-deep/70 to-transparent" />

      <div className="section relative z-10 mx-auto max-w-[1400px] px-6 md:px-10">
        <h2 className="display text-[clamp(2.2rem,6vw,5rem)]">
          Have a piece
          <br />
          in mind?
        </h2>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-canvas/60">
          Send us the sketch. We will tell you the material, the method and what it costs before
          anything gets cut.
        </p>
        <Magnetic>
          <PillCTA href="/contact" size="lg" className="mt-10">
            Request a quote
          </PillCTA>
        </Magnetic>
      </div>

      <div aria-hidden className="relative z-10 overflow-hidden">
        <p className="display -mb-[0.18em] translate-y-[0.06em] text-center text-[16.5vw] leading-none text-canvas/[0.07]">
          Ajdaam
        </p>
      </div>
    </section>
  );
}

