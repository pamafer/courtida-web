import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Usar service role ou anon key para escrita server-side
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Monuv envia diferentes tipos de eventos
    // Campos comuns: event_id, camera_id, camera_name, event_at, event_description
    const {
      event_id,
      camera_id,
      camera_name,
      client_id,
      event_description,
      event_at,
      event_url,
      event_thumb,
    } = body;

    // Salvar evento no Supabase
    const { error } = await supabase.from("camera_events").insert({
      event_id: event_id || null,
      camera_id: camera_id || null,
      camera_name: camera_name || null,
      client_id: client_id || null,
      event_description: event_description || null,
      event_at: event_at ? new Date(event_at) : new Date(),
      event_url: event_url || null,
      event_thumb: event_thumb || null,
      raw_data: body,
    });

    if (error) {
      console.error("Erro ao salvar evento Monuv:", error);
      return NextResponse.json(
        { status: "error", message: "Erro ao salvar evento" },
        { status: 500 }
      );
    }

    console.log(`Evento Monuv recebido: ${event_description} - ${camera_name}`);

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Erro no webhook Monuv:", error);
    return NextResponse.json(
      { status: "error", message: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}

// GET para teste - verificar se o endpoint está ativo
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Webhook courtida ativo",
    timestamp: new Date().toISOString(),
  });
}
