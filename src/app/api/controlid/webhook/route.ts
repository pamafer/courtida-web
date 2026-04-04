import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Endpoint para receber notificações do Monitor do IDFace Control iD
// O IDFace envia POST para: hostname:port/api/notifications/access_log
// Configurar no IDFace: hostname = courtida.com, port = 443, path = api/controlid/webhook

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // O IDFace envia diferentes formatos dependendo do tipo de notificação
    // access_log: quando alguém é identificado (ou tentou acesso)
    // Formato típico do access_log:
    // {
    //   "device_id": 935107,
    //   "time": 1484126902,
    //   "event": 7,  (7 = acesso liberado, 3 = acesso negado)
    //   "user_id": 123,
    //   "user_name": "João Silva",
    //   "portal_id": 1,
    //   "user_image": "base64..."
    // }

    const deviceId = body.device_id?.toString() || null;
    const userId = body.user_id?.toString() || null;
    const userName = body.user_name || body.name || null;
    const eventType = body.event ?? null;
    const eventTime = body.time ? new Date(body.time * 1000) : new Date();
    const portalId = body.portal_id ?? null;

    // Mapear tipos de evento do Control iD
    const eventNames: Record<number, string> = {
      1: "Equipamento inválido",
      2: "Parâmetros de regra de acesso inválidos",
      3: "Acesso não autorizado",
      4: "Acesso pendente",
      5: "Acesso via timeout",
      6: "Acesso negado",
      7: "Acesso liberado",
      8: "Acesso bloqueado",
      9: "Acesso expirado",
      10: "Acesso não identificado",
      11: "Acesso liberado (visitante)",
    };

    const eventName = eventNames[eventType] || `Evento ${eventType}`;
    const accessGranted = eventType === 7 || eventType === 11;

    // Salvar no Supabase
    const { error } = await supabase.from("access_events").insert({
      device_id: deviceId,
      user_id: userId,
      user_name: userName,
      event_type: eventType,
      event_name: eventName,
      access_granted: accessGranted,
      time: body.time || null,
      event_at: eventTime,
      portal_id: portalId,
      raw_data: body,
    });

    if (error) {
      console.error("Erro ao salvar evento Control iD:", error);
      return NextResponse.json(
        { status: "error", message: "Erro ao salvar evento" },
        { status: 500 }
      );
    }

    console.log(
      `Control iD: ${eventName} - ${userName || "desconhecido"} - Device ${deviceId}`
    );

    // O IDFace espera uma resposta vazia ou com comandos
    // Resposta vazia = nenhum comando a executar
    return NextResponse.json({});
  } catch (error) {
    console.error("Erro no webhook Control iD:", error);
    return NextResponse.json(
      { status: "error", message: "Erro ao processar evento" },
      { status: 500 }
    );
  }
}

// GET para teste - verificar se o endpoint está ativo
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Webhook Control iD courtida ativo",
    timestamp: new Date().toISOString(),
  });
}
