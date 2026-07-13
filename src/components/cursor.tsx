'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

type Mode = 'default' | 'link' | 'native';

/**
 * The tool-head cursor. A precise glowing dot rides the pointer exactly —
 * the tool centre, in the same pilot-light blue as the ticks — while a fine
 * crosshair ring trails it on a spring, like a laser sight settling. Over
 * anything clickable the ring blooms open to frame the target; on press it
 * tightens like a plunge cut; over text fields it steps aside entirely and
 * hands back the native caret.
 *
 * Mounts only on fine-pointer devices, never for reduced motion, and the
 * native cursor is hidden only while the custom one is actually live.
 */
export function ToolCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>('default');
  const [pressed, setPressed] = useState(false);
  const [seen, setSeen] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 22, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 260, damping: 22, mass: 0.5 });

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia('(pointer: fine) and (hover: hover)');
    const update = () => setEnabled(fine.matches);
    update();
    fine.addEventListener('change', update);
    return () => fine.removeEventListener('change', update);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;

    let lastEl: Element | null = null;
    let raf = 0;

    const detect = (target: Element | null) => {
      if (!target) return;
      if (target.closest('input, textarea, select, [contenteditable="true"]')) {
        setMode('native');
      } else if (target.closest('a, button, [role="button"], summary, label')) {
        setMode('link');
      } else {
        setMode('default');
      }
    };

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setSeen(true);
    };

    const onOver = (e: Event) => {
      const target = e.target as Element | null;
      if (!target || !(target instanceof Element)) return;
      lastEl = target;
      detect(target);
    };

    /* The page is alive under a still hand: browsers leave hover stale
       while scrolling, so while the page moves we look up what has slid
       under the resting cursor and hand it the full event vocabulary a
       real pointer would produce — pointer + mouse, bubbling over/out
       pairs (what React's delegation synthesizes enter/leave from) and
       non-bubbling enter/leave walked along the real ancestor chains
       (what native listeners want). */
    const ancestors = (node: Element | null) => {
      const chain: Element[] = [];
      let n: Element | null = node;
      while (n) {
        chain.push(n);
        n = n.parentElement;
      }
      return chain;
    };

    const fire = (
      target: Element,
      type: string,
      bubbles: boolean,
      cx: number,
      cy: number,
      related: Element | null,
    ) => {
      const pointer = type.startsWith('pointer');
      const Ctor = pointer && typeof PointerEvent !== 'undefined' ? PointerEvent : MouseEvent;
      target.dispatchEvent(
        new Ctor(type, {
          bubbles,
          cancelable: true,
          view: window,
          clientX: cx,
          clientY: cy,
          relatedTarget: related,
          ...(pointer ? { pointerId: 1, pointerType: 'mouse', isPrimary: true } : {}),
        } as PointerEventInit),
      );
    };

    const syncUnderCursor = () => {
      const cx = x.get();
      const cy = y.get();
      if (cx < 0 || cy < 0) return;

      const el = document.elementFromPoint(cx, cy);
      if (!el) return;

      detect(el);

      if (el !== lastEl) {
        const fromChain = ancestors(lastEl);
        const toChain = ancestors(el);
        const fromSet = new Set(fromChain);
        const common = toChain.find((n) => fromSet.has(n)) ?? null;

        // Out of the old target: bubbling out pair, then leave up the chain.
        if (lastEl) {
          fire(lastEl, 'pointerout', true, cx, cy, el);
          fire(lastEl, 'mouseout', true, cx, cy, el);
          for (const n of fromChain) {
            if (n === common) break;
            fire(n, 'pointerleave', false, cx, cy, el);
            fire(n, 'mouseleave', false, cx, cy, el);
          }
        }

        // Into the new one: bubbling over pair, then enter down the chain.
        fire(el, 'pointerover', true, cx, cy, lastEl);
        fire(el, 'mouseover', true, cx, cy, lastEl);
        const entering: Element[] = [];
        for (const n of toChain) {
          if (n === common) break;
          entering.push(n);
        }
        for (const n of entering.reverse()) {
          fire(n, 'pointerenter', false, cx, cy, lastEl);
          fire(n, 'mouseenter', false, cx, cy, lastEl);
        }

        lastEl = el;
      }

      // Always a move: elements sliding under the pointer keep reacting
      // (tilt, magnetism) even when the target hasn't changed.
      fire(el, 'pointermove', true, cx, cy, null);
      fire(el, 'mousemove', true, cx, cy, null);
    };

    /* Run while scrolling and briefly after, so momentum is covered too. */
    let lastScrollAt = 0;
    const loop = () => {
      syncUnderCursor();
      if (performance.now() - lastScrollAt < 200) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const onScroll = () => {
      lastScrollAt = performance.now();
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setSeen(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, true);
    // Capture-phase so scrolls inside nested scrollers count too.
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('wheel', onScroll, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver, true);
      window.removeEventListener('scroll', onScroll, { capture: true } as EventListenerOptions);
      window.removeEventListener('wheel', onScroll);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, x, y]);

  // Hide the native cursor only while the custom one is live and not over
  // a text field.
  useEffect(() => {
    const on = enabled && seen && mode !== 'native';
    document.documentElement.classList.toggle('tool-cursor', on);
    return () => document.documentElement.classList.remove('tool-cursor');
  }, [enabled, seen, mode]);

  if (!enabled) return null;

  const visible = seen && mode !== 'native';
  const ringScale = !visible ? 0.4 : mode === 'link' ? (pressed ? 1.5 : 1.9) : pressed ? 0.75 : 1;

  return (
    <>
      {/* The trailing sight ring. */}
      <motion.div
        aria-hidden
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed left-0 top-0 z-[120]"
      >
        <motion.div
          animate={{ scale: ringScale, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={`relative -ml-4 -mt-4 size-8 rounded-full border transition-colors duration-300 ${
            mode === 'link' ? 'border-scribe bg-scribe/8' : 'border-scribe/50'
          }`}
        >
          {/* Crosshair ticks at the cardinal points. */}
          <span aria-hidden className="absolute left-1/2 top-0 h-1 w-px -translate-x-1/2 bg-scribe/70" />
          <span aria-hidden className="absolute bottom-0 left-1/2 h-1 w-px -translate-x-1/2 bg-scribe/70" />
          <span aria-hidden className="absolute left-0 top-1/2 h-px w-1 -translate-y-1/2 bg-scribe/70" />
          <span aria-hidden className="absolute right-0 top-1/2 h-px w-1 -translate-y-1/2 bg-scribe/70" />
        </motion.div>
      </motion.div>

      {/* The tool centre: rides the pointer exactly. */}
      <motion.div
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[120]"
      >
        <motion.div
          animate={{ scale: pressed ? 0.7 : 1, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="-ml-[3px] -mt-[3px] size-1.5 rounded-full bg-scribe shadow-[0_0_10px_rgba(27,79,199,0.8)]"
        />
      </motion.div>
    </>
  );
}
