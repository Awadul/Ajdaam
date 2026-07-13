import type { Metadata } from 'next';
import { services } from '@/lib/site';
import { projects } from '@/lib/projects';
import { CutLine, Reveal } from '@/components/motion';
import { CallToAction, Chip, Eyebrow, MediaFrame } from '@/components/ui';
import { ServicesIndex } from '@/components/services-index';
import { ServicesList } from '@/components/services-list';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'CNC machining, fiber laser cutting, plasma cutting, laser engraving, 3D wood carving and custom product development in Islamabad.',
};

// One representative shot per service, pulled from the real timeline.
const shots: Record<string, string> = {
  'cnc-machining': 'CEzTdoxHx9G',
  'fiber-laser': 'CDZ7hcol16-',
  'plasma-cutting': 'CFeA8cAFLHY',
  'laser-cutting': 'CCllBdMFx2L',
  'wood-carving': 'CFAWzjUnN5n',
  'product-development': 'CNVWBdhHU3s',
};

export default function ServicesPage() {
  return (
    <>
      <section className="section-lead mx-auto max-w-[1400px] px-6 md:px-10">
        <h1 className="display max-w-4xl text-[clamp(2.75rem,8vw,7rem)]">
          Six ways
          <br />
          to cut a thing
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-graphite">
          Which machine runs your job depends on the material and the tolerance, not on what happens
          to be free. We pick the tool that suits the part.
        </p>
      </section>

      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <ServicesList />
      </div>

      <div className="mx-auto mt-20 grid max-w-[1400px] gap-16 px-6 md:px-10 lg:grid-cols-[200px_1fr] lg:gap-20">
        <ServicesIndex />

        <div>
        {services.map((service, i) => {
          const project = projects.find((p) => p.id === shots[service.slug]);
          const flip = i % 2 === 1;

          const tinted = i % 2 === 1;

          return (
            <article
              key={service.slug}
              id={service.slug}
              className={`section scroll-mt-28 ${tinted ? '-mx-6 bg-wash px-6 md:-mx-10 md:px-10' : ''}`}
            >
              <CutLine />

              <div
                className={`mt-10 grid gap-10 xl:grid-cols-2 xl:items-center xl:gap-16 ${
                  flip ? 'xl:[&>*:first-child]:order-2' : ''
                }`}
              >
                <Reveal>
                  <p className="spec">{service.spec}</p>
                  <h2 className="display mt-6 text-[clamp(2rem,4.5vw,3.75rem)]">{service.name}</h2>
                  <p className="mt-8 text-lg leading-relaxed text-graphite">{service.detail}</p>

                  <div className="mt-10 flex flex-wrap gap-2.5">
                    {service.doesWell.map((item) => (
                      <Chip key={item}>{item}</Chip>
                    ))}
                  </div>
                </Reveal>

                <Reveal delay={0.1}>
                  {project && (
                    <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-hairline/40 shadow-[0_18px_42px_rgba(20,24,31,0.14)]">
                      <MediaFrame media={project.media[0]} alt={service.name} />
                    </div>
                  )}
                </Reveal>
              </div>
            </article>
          );
        })}
        </div>
      </div>

      <div className="h-20 md:h-32" />
      <CallToAction />
    </>
  );
}
