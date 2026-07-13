import { CinemaHero } from '@/components/home-cinema';
import { AssemblyHero } from '@/components/assembly-showcase';
import { landingAssembly } from '@/lib/showcase';
import {
  AuthorityPanorama,
  CapabilityDeck,
  CaseDeck,
  ClientOrbit,
  CtaDimension,
  StandardsFlip,
} from '@/components/home-dimension';
import { WorkshopShowcase } from '@/components/workshop-showcase';

/**
 * The home page as a sequence of motion scenes:
 *
 *   1. CinemaHero        — entrance choreography: type rises, footage unclips.
 *   2. ClientOrbit       — CSS 3D: the roster turning on a slow carousel.
 *   3. WorkshopShowcase  — the console: Methods / Stock / Outputs, free-
 *                          scrolling and self-running; motion earns the
 *                          stop instead of a pin enforcing it.
 *   4. AuthorityPanorama — light interlude: the one-roof claim inks in
 *                          word by word on scroll, photo as one tilt card.
 *   5. CapabilityDeck    — tilt cards with figures standing off the face;
 *                          the free-scrolling breath between the two pins.
 *   6. AssemblyHero      — pinned: a carved panel hangs in nine scattered
 *                          shards and the scroll flies them together.
 *   7. CaseDeck          — expanding photo strip: one result line per job.
 *   8. StandardsFlip     — audit rows tipping into place.
 *   9. CtaDimension      — three.js: a wireframe coil turning behind the ask.
 *
 * The page closes on the ask. Every stat it needs lives earlier on the page
 * (the hero counters, the Why-Ajdaam copy, the capability deck).
 */
export default function Home() {
  return (
    <>
      {/* The opening scene. */}
      <CinemaHero />

      {/* Client trust, first proof — the roster on a turning ring. */}
      <div className="mt-14 md:mt-20">
        <ClientOrbit />
      </div>

      {/* Production Laboratory: Methods, Stock, and Outputs combined */}
      <WorkshopShowcase />

      {/* Why Ajdaam. A light interlude: the one-roof claim inks itself in
          word by word as the reader scrolls. */}
      <AuthorityPanorama />

      {/* Capabilities. A light, free-scrolling breath between the two
          pinned scenes. */}
      <CapabilityDeck />

      {/* The full-scale moment: one piece arrives in parts, and the scroll
          flies them together — then its spec sheet rises. */}
      <AssemblyHero item={landingAssembly} />

      {/* Case studies. The photo talks; one result line per job. */}
      <CaseDeck />

      {/* Standards. The audit trail, filed sheet by sheet. */}
      <StandardsFlip />

      {/* The closing ask, with the wire coil turning behind it. */}
      <CtaDimension />
    </>
  );
}
