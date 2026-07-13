import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { QuoteForm } from './quote-form';
import { CutLine } from '@/components/motion';
import { Eyebrow } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Request a quote from Ajdaam Machine Craft. NSTP, G-11, Islamabad.',
};

export default function ContactPage() {
  return (
    <section className="section-lead mx-auto max-w-[1400px] px-6 pb-24 md:px-10 md:pb-32">
      <h1 className="display max-w-4xl text-[clamp(2.75rem,8vw,7rem)]">
        Send us
        <br />
        the sketch
      </h1>
      <p className="mt-8 max-w-xl text-lg leading-relaxed text-graphite">
        Tell us what you want made and roughly how big. We will come back with the material, the
        method and a price before anything gets cut.
      </p>

      <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-24">
        <div>
          <CutLine />

          <div className="mt-10 space-y-6">
            <div className="rounded-lg bg-wash p-6">
              <p className="spec">Workshop</p>
              <p className="mt-4 text-lg leading-relaxed">{site.location}</p>
            </div>

            <div className="rounded-lg bg-wash p-6">
              <p className="spec">Instagram</p>
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-lg underline-offset-8 hover:underline"
              >
                {site.instagramHandle}
              </a>
            </div>

            <div className="rounded-lg bg-wash p-6">
              <p className="spec">Hours</p>
              <p className="mt-4 text-lg leading-relaxed text-graphite">
                Monday to Saturday
                <br />
                Walk in with a drawing, or send it ahead.
              </p>
            </div>
          </div>
        </div>

        <div>
          <CutLine />
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}
