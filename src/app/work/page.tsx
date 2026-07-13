import type { Metadata } from 'next';
import { WorkGrid } from './work-grid';
import { CallToAction, Eyebrow } from '@/components/ui';

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
          Signage, panels, furniture, fitouts and one off pieces. Filter by what you are after, or
          scroll through all of it.
        </p>
      </section>

      <WorkGrid />

      <div className="h-32 md:h-48" />
      <CallToAction />
    </>
  );
}
