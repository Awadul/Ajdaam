import type { Metadata } from 'next';
import { process } from '@/lib/site';
import { CutLine, Reveal } from '@/components/motion';
import { CallToAction, Eyebrow } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Process',
  description:
    'How a job moves through Ajdaam Machine Craft: drawing, programming, sample, cutting, finishing, delivery.',
};

export default function ProcessPage() {
  return (
    <>
      <section className="section-lead mx-auto max-w-[1400px] px-6 md:px-10">
        <h1 className="display max-w-4xl text-[clamp(2.75rem,8vw,7rem)]">
          Drawing
          <br />
          to delivery
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-graphite">
          Six steps, in this order, every time. The numbers are not decoration. A job that skips the
          sample is a job that gets cut twice.
        </p>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 md:px-10">
        {process.map((step, i) => (
          <Reveal key={step.step}>
            <article className="group grid gap-6 border-t border-hairline py-9 transition-colors duration-500 hover:bg-wash md:grid-cols-[auto_1fr_2fr] md:items-baseline md:gap-16 md:py-11">
              <span className="spec text-lg! text-scribe! transition-colors duration-500">
                {step.step}
              </span>

              <h2 className="display text-[clamp(1.75rem,4vw,3rem)]">{step.name}</h2>

              <p className="max-w-2xl text-lg leading-relaxed text-graphite">{step.body}</p>

              {i === process.length - 1 && (
                <span aria-hidden className="hidden size-2 bg-cut-deep md:block" />
              )}
            </article>
          </Reveal>
        ))}
        <CutLine />
      </section>

      <section className="section-tight bg-wash">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <Reveal>
            <div className="grid gap-12 py-12 md:grid-cols-2 md:gap-20 md:py-16">
              <div>
                <p className="spec">Lead time</p>
                <p className="mt-6 text-lg leading-relaxed text-ink/80">
                  A single cut sample usually turns around in a day or two. A production run
                  depends on the sheet count and the finishing. We tell you a real date, not an
                  optimistic one.
                </p>
              </div>
              <div>
                <p className="spec">What we need from you</p>
                <p className="mt-6 text-lg leading-relaxed text-ink/80">
                  A drawing in any form, the material if you have a preference, the finished size,
                  and how many. If you only have a photo of something you liked, start there. We
                  have worked from less.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CallToAction />
    </>
  );
}
