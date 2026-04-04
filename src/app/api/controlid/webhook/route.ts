import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Endpoint para receber notificações do Monitor do IDFace Control iD
// URL configurada no IDFace: https://courtida.com/api/controlid/webhook?token=UUID_DO_DISPOSITIVO
// Cada dispositivo tem um token único gerado na tabela access_devices

export async function POST(request: NextRequest) {
  try {
    // 1. Validar token do dispositivo
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      console.warn("Control iD webhook: requisição sem token");
      return NextResponse.json(
        { status: "error", message: "Token não fornecido" },
        { status: 401 }
      );
    }

    // Buscar dispositivo pelo token na tabela access_devices
    const { data: device, error: deviceError } = await supabase
      .from("access_devices")
      .select("id, name, court_id, club_id, is_active")
      .eq("token", token)
      .single();

    if (deviceError || !device) {
      console.warn(`Control iD webhook: token inválido — ${token}`);
      return NextResponse.json(
        { status: "error", message: "Token inválido" },
        { status: 401 }
      );
    }

    if (!device.is_active) {
      console.warn(`Control iD webhook: dispositivo desativado — ${device.name}`);
      return NextResponse.json(
        { status: "error", message: "Dispositivo desativado" },
        { status: 403 }
      );
    }

    // 2. Atualizar last_seen_at e is_online do dispositivo
    await supabase
      .from("access_devices")
      .update({ is_online: true, last_seen_at: new Date().toISOString() })
      .eq("id", device.id);

    // 3. Processar o evento
    const body = await request.json();

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

    // 4. Salvar evento com vínculo ao dispositivo, quadra e clube
    const { error } = await supabase.from("access_events").insert({
      device_id: device.id,
      court_id: device.court_id,
      club_id: device.club_id,
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
      `Control iD: ${eventName} — ${userName || "desconhecido"} — ${device.name} (${device.id})`
    );

    // O IDFace espera uma resposta vazia ou com comandos
    return NextResponse.json({});
  } catch (error) {
    console.error("Erro no webhook Control iD:", error);
    return NextResponse.json(
      { status: "error", message: "Erro ao processar evento" },
      { status: 500 }
    );
  }
}

// GET para teste — verificar se o endpoint está ativo
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (token) {
    const { data: device } = await supabase
      .from("access_devices")
      .select("id, name, is_active, is_online, last_seen_at")
      .eq("token", token)
      .single();

    return NextResponse.json({
      status: "ok",
      message: "Webhook Control iD courtida ativo",
      device: device || "Token não encontrado",
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    status: "ok",
    message: "Webhook Control iD courtida ativo",
    usage: "Adicione ?token=UUID_DO_DISPOSITIVO para verificar um dispositivo",
    timestamp: new Date().toISOString(),
  });
}
