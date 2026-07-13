'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { nav, site } from '@/lib/site';
import { Logo } from '@/components/logo';
import { PillCTA } from '@/components/ui';

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`nav-in sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-hairline bg-paper/85 shadow-[0_10px_30px_-24px_rgba(20,24,31,0.4)] backdrop-blur-md backdrop-saturate-150'
          : 'border-transparent bg-transparent'
      }`}
      style={{ transitionTimingFunction: 'var(--ease-cut)' }}
    >
      <div className="relative mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3 md:px-10">
        <Link href="/" className="group flex items-center gap-2.5">
          <Logo size={26} priority />
          <span className="flex items-baseline gap-2">
            <span className="display text-base tracking-tight md:text-lg">
              Ajdaam<span className="text-cut-deep">.</span>
            </span>
            <span className="spec hidden transition-colors group-hover:text-ink sm:inline">
              Machine Craft
            </span>
          </span>
        </Link>

        {/* Centred on the viewport, not the space between the logo and the
            CTA — so it stays dead centre regardless of how wide either of
            those end up (the logo wordmark and "Request a quote" are not
            the same width). */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="tap relative flex items-center text-sm font-medium text-graphite transition-colors hover:text-ink"
              >
                <span className={active ? 'text-ink' : undefined}>{item.label}</span>
                {active && (
                  <motion.span
                    layoutId="nav-cut"
                    className="absolute -bottom-0.5 left-0 right-0 h-px bg-scribe"
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-4">
          <PillCTA href="/contact" size="sm" className="hidden md:inline-flex">
            Request a quote
          </PillCTA>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="tap flex size-11 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`h-px w-5 bg-ink transition-transform duration-300 ${
                open ? 'translate-y-[3.5px] rotate-45' : ''
              }`}
            />
            <span
              className={`h-px w-5 bg-ink transition-transform duration-300 ${
                open ? '-translate-y-[3.5px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-hairline bg-paper md:hidden"
          >
            <div className="flex flex-col px-6 py-4">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-b border-hairline py-4 font-display text-2xl uppercase tracking-tight"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="mt-6 rounded-full bg-scribe px-5 py-4 text-center text-sm font-medium text-canvas"
              >
                Request a quote
              </Link>
              <p className="spec mt-6">{site.location}</p>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
