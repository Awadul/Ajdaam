import type { Metadata } from 'next';
import { projects } from '@/lib/projects';
import { Eyebrow, CallToAction } from '@/components/ui';
import { AssemblyHero } from '@/components/assembly-showcase';
import { showcaseItems } from '@/lib/showcase';
import { WorkGrid } from '@/app/work/work-grid';

export const metadata: Metadata = {
  title: 'Showcase (testing)',
  description:
    'Pieces manufactured at Ajdaam Machine Craft, assembled in front of you — then the full catalogue.',
  robots: { index: false },
};

/**
 * /testing — the assembly showcase, in three beats:
 *
 *   1. A short lead-in that sets the premise.
 *   2. Two hero pieces, each pinned: the product photo hangs as nine
 *      scattered shards and the reader's scroll flies them together;
 *      when the piece closes, its full spec sheet rises over it.
 *   3. The complete catalogue underneath, with the same category filters
 *      the work page uses.
 *
 * Experimental page — not linked from the nav, not indexed.
 */
export default function TestingShowcasePage() {
  return (
    <>
      {/* The premise. */}
      <section className="section-lead mx-auto max-w-[1400px] px-6 md:px-10">
        <Eyebrow>Showcase</Eyebrow>
        <h1 className="display mt-8 max-w-4xl text-[clamp(2.5rem,7vw,6rem)]">
          Every piece
          <br />
          arrives in parts
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-graphite">
          Nothing here came off a shelf. Scroll, and put two of our pieces together the way the
          shop does — then browse everything we&apos;ve cut.
        </p>
      </section>

      {/* The two hero pieces, assembled by the reader. */}
      {showcaseItems.map((item) => (
        <AssemblyHero key={item.projectId} item={item} />
      ))}

      {/* The whole catalogue. */}
      <section className="section-tight mx-auto max-w-[1400px] px-6 md:px-10">
        <Eyebrow>The catalogue</Eyebrow>
        <h2 className="display mt-5 text-[clamp(1.6rem,3.6vw,3rem)]">
          All {projects.length} pieces
        </h2>
      </section>
      <WorkGrid />

      <div className="mt-16 md:mt-24">
        <CallToAction />
      </div>
    </>
  );
}
