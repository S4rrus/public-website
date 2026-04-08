import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let payload: any = null;

  try {
    payload = await request.json();
  } catch (err) {
    return Response.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const {
    name,
    email,
    handle,
    focus,
    skills,
    links,
    message,
    company
  } = payload ?? {};

  if (company) {
    return Response.json({ ok: true }, { status: 200 });
  }

  if (!name || !email || !message) {
    return Response.json({ error: 'Name, email, and message are required.' }, { status: 400 });
  }

  if (!emailRegex.test(String(email))) {
    return Response.json({ error: 'Please provide a valid email address.' }, { status: 400 });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const mailFrom = process.env.MAIL_FROM || 'sarrus apply <contact@sarrus.org>';
  const mailTo = process.env.MAIL_TO || 'contact@sarrus.org';

  if (!smtpHost || !smtpUser || !smtpPass) {
    return Response.json({ error: 'Email service is not configured.' }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  const subjectHandle = handle ? ` (${handle})` : '';

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    handle ? `Handle: ${handle}` : null,
    focus ? `Focus / Role Interests: ${focus}` : null,
    skills ? `Skills: ${skills}` : null,
    links ? `Links: ${links}` : null,
    '',
    'Message:',
    message
  ]
    .filter(Boolean)
    .join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>New sarrus application</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${handle ? `<p><strong>Handle:</strong> ${handle}</p>` : ''}
      ${focus ? `<p><strong>Focus / Role Interests:</strong> ${focus}</p>` : ''}
      ${skills ? `<p><strong>Skills:</strong> ${skills}</p>` : ''}
      ${links ? `<p><strong>Links:</strong> ${links}</p>` : ''}
      <hr />
      <p><strong>Message:</strong></p>
      <p>${String(message).replace(/\n/g, '<br />')}</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      replyTo: email,
      subject: `sarrus application from ${name}${subjectHandle}`,
      text,
      html
    });

    return Response.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('Apply email error:', err);
    const devMessage =
      process.env.NODE_ENV !== 'production' && err instanceof Error
        ? `Failed to send email: ${err.message}`
        : 'Failed to send email. Please try again.';
    return Response.json({ error: devMessage }, { status: 500 });
  }
}
