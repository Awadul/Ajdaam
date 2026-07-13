'use client';

import { useEffect, useState } from 'react';
import { services } from '@/lib/site';

/**
 * A sticky index for the services page.
 *
 * Six long sections in a row leave a reader with no sense of where they are or
 * how much is left. This pins the list to the side, marks the section currently
 * in view, and lets anyone jump straight to the machine they came for. The
 * marker is the same blue that draws every other line on this site.
 *
 * Below `lg` there is no room for a rail, so it is not rendered at all rather
 * than being crushed into a strip nobody can read.
 */
export function ServicesIndex() {
  const [active, setActive] = useState(services[0].slug);

  useEffect(() => {
    const sections = services
      .map((s) => document.getElementById(s.slug))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      // Fire when a section crosses the upper third, which is where the eye sits.
      { rootMargin: '-20% 0px -60% 0px' },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Services" className="sticky top-28 hidden lg:block">
      <p className="spec flex items-center gap-2.5">
        <span aria-hidden className="size-1.5 bg-scribe" />
        All six
      </p>

      <ul className="mt-6 space-y-0">
        {services.map((service, i) => {
          const current = active === service.slug;

          return (
            <li key={service.slug}>
              <a
                href={`#${service.slug}`}
                aria-current={current ? 'true' : undefined}
                className="group flex items-baseline gap-4 border-l border-hairline py-2.5 pl-4 transition-colors duration-300"
                style={current ? { borderColor: 'var(--color-scribe)' } : undefined}
              >
                <span className={`spec ${current ? 'text-scribe!' : ''}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={`text-sm font-medium transition-colors duration-300 ${
                    current ? 'text-ink' : 'text-graphite group-hover:text-ink'
                  }`}
                >
                  {service.name}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
