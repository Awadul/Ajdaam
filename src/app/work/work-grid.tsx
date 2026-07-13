'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { categories, projects, type Category } from '@/lib/projects';
import { ProjectCard } from '@/components/ui';
import { CutLine } from '@/components/motion';

export function WorkGrid() {
  const [active, setActive] = useState<Category | 'all'>('all');

  const counts = useMemo(() => {
    const map = new Map<string, number>([['all', projects.length]]);
    for (const p of projects) map.set(p.category, (map.get(p.category) ?? 0) + 1);
    return map;
  }, []);

  const visible = useMemo(
    () => (active === 'all' ? projects : projects.filter((p) => p.category === active)),
    [active],
  );

  return (
    <section className="mx-auto max-w-[1400px] px-6 md:px-10">
      <CutLine />

      <div className="mt-8 flex flex-wrap gap-x-2 gap-y-3">
        {categories.map((cat) => {
          const count = counts.get(cat.key) ?? 0;
          if (!count) return null;
          const selected = active === cat.key;

          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActive(cat.key)}
              aria-pressed={selected}
              className={`tap flex items-center gap-2 border px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                selected
                  ? 'border-scribe bg-scribe text-canvas'
                  : 'border-hairline text-graphite hover:border-scribe hover:text-ink'
              }`}
            >
              {cat.label}
              <span className={`spec ${selected ? 'text-canvas/60!' : ''}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => (
            <motion.div
              key={project.id}
              layout
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectCard project={project} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
