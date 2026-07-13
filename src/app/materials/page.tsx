import type { Metadata } from 'next';
import { materials } from '@/lib/site';
import { projects } from '@/lib/projects';
import { CutLine, Reveal } from '@/components/motion';
import { CallToAction, Chip, Eyebrow, MediaFrame } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Materials',
  description:
    'Solid wood, MDF, acrylic, mild steel, aluminium cladding and PVC. What Ajdaam Machine Craft cuts, and what each material is good for.',
};

const shots = ['CCn_D7hFHJd', 'CC37tiKlbss', 'CDE-za8lrlx', 'CDZ7hcol16-', 'CBsT1hcllBw', 'CIODh5bnghY'];

export default function MaterialsPage() {
  return (
    <>
      <section className="section-lead mx-auto max-w-[1400px] px-6 md:px-10">
        <h1 className="display max-w-4xl text-[clamp(2.75rem,8vw,7rem)]">
          What we
          <br />
          cut through
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-graphite">
          Six materials, each with its own reason to exist. If you are unsure which one your piece
          wants to be, that is a conversation we have before anything is programmed.
        </p>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 md:px-10">
        <CutLine />

        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {materials.map((material, i) => {
            const project = projects.find((p) => p.id === shots[i]);

            return (
              <Reveal key={material.name} delay={(i % 3) * 0.08}>
                <article className="group">
                  <div className="relative aspect-square overflow-hidden bg-hairline/40 shadow-none transition-shadow duration-500 group-hover:shadow-[0_18px_42px_rgba(20,24,31,0.18)]">
                    {project && (
                      <div className="size-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
                        <MediaFrame media={project.media[0]} alt={material.name} />
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h2 className="font-display text-xl font-semibold uppercase leading-none tracking-tight">
                      {material.name}
                    </h2>
                    <Chip className="shrink-0">{material.spec}</Chip>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-graphite">{material.note}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="section bg-wash">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <CutLine />
          <Reveal>
            <p className="mt-12 max-w-4xl font-display text-[clamp(1.8rem,4vw,3.5rem)] font-semibold leading-[1.1] tracking-tight">
              Bringing your own stock?
              <span className="text-graphite">
                {' '}
                We will cut it, as long as you can tell us what it is.
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      <CallToAction />
    </>
  );
}
