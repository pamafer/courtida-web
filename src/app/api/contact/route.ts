import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, club, email, whatsapp, courts } = body;

    // Validação básica
    if (!name || !email || !whatsapp) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios." },
        { status: 400 }
      );
    }

    // Envia email via Resend
    await resend.emails.send({
      from: "courtida <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL!,
      subject: `Novo lead courtida: ${name} — ${club || "Sem clube"}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Novo interesse no courtida</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 140px;">Nome</td>
              <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Clube</td>
              <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${club || "Não informado"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">E-mail</td>
              <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">WhatsApp</td>
              <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;"><a href="https://wa.me/${whatsapp.replace(/\D/g, "")}">${whatsapp}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Quadras</td>
              <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${courts || "Não informado"}</td>
            </tr>
          </table>
          <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
            Enviado pelo formulário do site courtida.com
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return NextResponse.json(
      { error: "Erro ao enviar. Tente novamente." },
      { status: 500 }
    );
  }
}
