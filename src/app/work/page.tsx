import type { Metadata } from 'next';
import { WorkGrid } from './work-grid';
import { WorkStream } from '@/components/work-stream';
import { CallToAction } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Signage, decor panels, furniture, interiors, metal fabrication and one off pieces cut and carved at Ajdaam Machine Craft in Islamabad.',
};

export default function WorkPage() {
  return (
    <>
      <section className="section-lead mx-auto max-w-[1400px] px-6 md:px-10">
        <h1 className="display max-w-4xl text-[clamp(2.75rem,8vw,7rem)]">
          Everything here
          <br />
          was cut to order
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-graphite">
          Signage, panels, furniture, fitouts and one off pieces. Walk the reel, or filter the
          full catalogue below.
        </p>
      </section>

      {/* The library: every piece assembling itself as the scroll carries
          it into view — shards, slats and deep swings taking turns. */}
      <WorkStream />

      {/* The catalogue, for finding rather than wandering. */}
      <div className="mt-24 md:mt-36">
        <WorkGrid />
      </div>

      <div className="h-32 md:h-48" />
      <CallToAction />
    </>
  );
}
