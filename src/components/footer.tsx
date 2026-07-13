import Link from 'next/link';
import { nav, services, site } from '@/lib/site';
import { Logo } from '@/components/logo';

export function Footer() {
  return (
    <footer className="bg-ink-deep text-canvas">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <Logo variant="dark" size={56} />
              <p className="display text-5xl md:text-6xl">Ajdaam</p>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-canvas/60">{site.tagline}</p>
          </div>

          <div>
            <p className="spec text-canvas/40!">Pages</p>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-canvas/70 transition-colors hover:text-scribe-lift">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="spec text-canvas/40!">Services</p>
            <ul className="mt-5 space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services#${s.slug}`}
                    className="text-sm text-canvas/70 transition-colors hover:text-scribe-lift"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          aria-hidden
          className="mt-14 h-px w-full bg-linear-to-r from-transparent via-scribe/35 to-transparent"
        />

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="spec text-canvas/40!">{site.location}</p>
          <div className="flex items-center gap-6">
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="spec text-canvas/60! transition-colors hover:text-scribe-lift"
            >
              {site.instagramHandle}
            </a>
            <p className="spec text-canvas/40!">
              &copy; {new Date().getFullYear()} {site.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
