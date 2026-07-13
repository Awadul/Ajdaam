import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[1400px] flex-col justify-center px-6 md:px-10">
      <p className="spec">Error 404</p>
      <h1 className="display mt-8 text-[clamp(2.75rem,8vw,7rem)]">
        Nothing on
        <br />
        this bed
      </h1>
      <p className="mt-10 max-w-md text-lg leading-relaxed text-graphite">
        The page you asked for was never cut. Try the work instead.
      </p>
      <Link
        href="/work"
        className="mt-12 inline-flex w-fit items-center gap-4 border border-ink px-8 py-4 font-medium transition-colors hover:bg-ink hover:text-paper"
      >
        See the work
        <span aria-hidden>&rarr;</span>
      </Link>
    </section>
  );
}
