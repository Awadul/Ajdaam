'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { materials, services } from '@/lib/site';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const field =
  'w-full border-0 border-b border-hairline bg-transparent px-0 py-4 text-lg transition-colors placeholder:text-graphite/60 focus:border-scribe focus:outline-none';

export function QuoteForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError('');

    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('The request did not go through. Try again, or send it on Instagram.');
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="mt-10 rounded-lg border border-ink p-10 shadow-[0_18px_42px_rgba(20,24,31,0.1)]">
        <span aria-hidden className="mb-6 block size-2 bg-cut-deep" />
        <p className="font-display text-3xl uppercase tracking-tight">Drawing received</p>
        <p className="mt-5 leading-relaxed text-graphite">
          We will come back to you with the material, the method and a price. Usually within a day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-10">
      <div className="grid gap-10 sm:grid-cols-2">
        <label className="block">
          <span className="spec">Name</span>
          <input name="name" required autoComplete="name" placeholder="Your name" className={field} />
        </label>

        <label className="block">
          <span className="spec">Email or phone</span>
          <input name="contact" required placeholder="How we reach you" className={field} />
        </label>
      </div>

      <div className="grid gap-10 sm:grid-cols-2">
        <label className="block">
          <span className="spec">Service</span>
          <select name="service" required defaultValue="" className={field}>
            <option value="" disabled>
              Not sure yet
            </option>
            {services.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
            <option value="Not sure">Not sure, help me pick</option>
          </select>
        </label>

        <label className="block">
          <span className="spec">Material</span>
          <select name="material" required defaultValue="" className={field}>
            <option value="" disabled>
              Not sure yet
            </option>
            {materials.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}
              </option>
            ))}
            <option value="Not sure">Not sure, help me pick</option>
          </select>
        </label>
      </div>

      <div className="grid gap-10 sm:grid-cols-2">
        <label className="block">
          <span className="spec">Finished size</span>
          <input name="size" placeholder="e.g. 3.5ft x 8ft" className={field} />
        </label>

        <label className="block">
          <span className="spec">Quantity</span>
          <input name="quantity" type="number" min={1} defaultValue={1} className={field} />
        </label>
      </div>

      <label className="block">
        <span className="spec">The piece</span>
        <textarea
          name="brief"
          required
          rows={4}
          placeholder="What are we making? A photo of something similar helps."
          className={`${field} resize-none`}
        />
      </label>

      {status === 'error' && (
        <p className="border-l-2 border-ink pl-4 text-sm leading-relaxed">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="tap inline-flex items-center gap-3 rounded-full bg-scribe py-2.5 pl-8 pr-2.5 text-lg font-medium text-canvas transition-colors duration-200 hover:bg-scribe-deep disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending' : 'Request a quote'}
        <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-canvas">
          <ArrowRight className="size-5 text-scribe" />
        </span>
      </button>
    </form>
  );
}
