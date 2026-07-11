import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const FROM = process.env.BOOKING_FROM_EMAIL ?? "LOFTZ <onboarding@resend.dev>";
const NOTIFY = process.env.BOOKING_NOTIFY_EMAIL ?? "henriquesantana@loftz.net";

const resend = apiKey ? new Resend(apiKey) : null;

export interface RequestEmailData {
  type: "booking" | "visit";
  roomName: string;
  residenceName: string;
  roomUrl: string;
  fullName: string;
  email: string;
  phone?: string | null;
  nationality?: string | null;
  dateOfBirth?: string | null;
  occupation?: string | null;
  gender?: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
  visitDate?: string | null;
  visitTime?: string | null;
  message?: string | null;
  locale: string;
}

function row(label: string, value?: string | null) {
  if (!value) return "";
  return `<tr><td style="padding:4px 12px 4px 0;color:#6f6a62">${label}</td><td style="padding:4px 0;font-weight:500">${value}</td></tr>`;
}

// Notification to Henrique (henriquesantana@loftz.net) — Q-12: email, no Slack.
export async function sendOwnerNotification(d: RequestEmailData) {
  if (!resend) return { skipped: true };
  const title =
    d.type === "booking" ? "New booking request" : "New visit request";
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto;color:#1b1a18">
      <h2 style="font-size:18px">${title}</h2>
      <p style="color:#6f6a62">${d.residenceName} · <strong>${d.roomName}</strong></p>
      <table style="border-collapse:collapse;font-size:14px;margin-top:12px">
        ${row("Name", d.fullName)}
        ${row("Email", d.email)}
        ${row("Phone", d.phone)}
        ${row("Nationality", d.nationality)}
        ${row("Date of birth", d.dateOfBirth)}
        ${row("Occupation", d.occupation)}
        ${row("Gender", d.gender)}
        ${row("Check-in", d.checkIn)}
        ${row("Check-out", d.checkOut)}
        ${row("Visit date", d.visitDate)}
        ${row("Visit time", d.visitTime)}
        ${row("Message", d.message)}
      </table>
      <p style="margin-top:16px"><a href="${d.roomUrl}" style="color:#14655b">View room →</a></p>
    </div>`;
  return resend.emails.send({
    from: FROM,
    to: NOTIFY,
    replyTo: d.email,
    subject: `${title}: ${d.residenceName} · ${d.roomName}`,
    html,
  });
}

// Branded confirmation to the guest.
export async function sendGuestConfirmation(d: RequestEmailData) {
  if (!resend) return { skipped: true };
  const pt = d.locale === "pt";
  const subject = pt
    ? `Recebemos o seu pedido — ${d.residenceName} · ${d.roomName}`
    : `We received your request — ${d.residenceName} · ${d.roomName}`;
  const intro = pt
    ? d.type === "booking"
      ? "Obrigado pelo seu pedido de reserva. A nossa equipa entrará em contacto em breve para confirmar a disponibilidade e os próximos passos."
      : "Obrigado pelo seu pedido de visita. Entraremos em contacto para confirmar uma hora."
    : d.type === "booking"
      ? "Thanks for your booking request. Our team will get back to you shortly to confirm availability and next steps."
      : "Thanks for your visit request. We'll be in touch to confirm a time.";
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto;color:#1b1a18">
      <div style="font-size:22px;font-weight:600;letter-spacing:-.5px">LOFTZ</div>
      <h2 style="font-size:18px;margin-top:16px">${pt ? "Pedido recebido" : "Request received"}</h2>
      <p style="color:#3d3b37;line-height:1.6">${intro}</p>
      <div style="background:#f7f6f2;border-radius:12px;padding:16px;margin-top:16px">
        <div style="color:#6f6a62;font-size:13px">${d.residenceName}</div>
        <div style="font-weight:600;font-size:16px">${d.roomName}</div>
        <a href="${d.roomUrl}" style="color:#14655b;font-size:14px">${pt ? "Ver o quarto" : "View the room"} →</a>
      </div>
      <p style="color:#6f6a62;font-size:13px;margin-top:20px">${pt ? "Com os melhores cumprimentos," : "Warm regards,"}<br/>LOFTZ</p>
    </div>`;
  return resend.emails.send({
    from: FROM,
    to: d.email,
    subject,
    html,
  });
}
