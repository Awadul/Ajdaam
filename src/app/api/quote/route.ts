import { NextResponse } from 'next/server';

/**
 * Quote requests land here.
 *
 * Right now this validates the payload and logs it. Wire it to whatever Ajdam
 * actually reads: Resend or Nodemailer to an inbox, a WhatsApp Business API
 * message, or a row in a database. The client does not care which.
 */

type QuotePayload = {
  name: string;
  contact: string;
  service: string;
  material: string;
  size?: string;
  quantity?: string;
  brief: string;
};

const required: (keyof QuotePayload)[] = ['name', 'contact', 'service', 'material', 'brief'];

export async function POST(request: Request) {
  let body: Partial<QuotePayload>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Send valid JSON.' }, { status: 400 });
  }

  const missing = required.filter((key) => !body[key]?.toString().trim());
  if (missing.length) {
    return NextResponse.json(
      { error: `Fill in: ${missing.join(', ')}` },
      { status: 400 },
    );
  }

  // Cheap honeypot against bots. Add a hidden input named `website` to the form
  // if you want this to catch anything.
  if ('website' in body && body.website) {
    return NextResponse.json({ ok: true });
  }

  console.log('[quote]', {
    ...body,
    receivedAt: new Date().toISOString(),
  });

  // TODO: replace with a real delivery mechanism before launch.
  // await resend.emails.send({ to: 'hello@ajdam.pk', subject: `Quote from ${body.name}`, text: ... });

  return NextResponse.json({ ok: true });
}
