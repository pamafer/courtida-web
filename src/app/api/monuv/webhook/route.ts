import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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

    const monuvCameraId = camera_id ? String(camera_id) : null;

    // Buscar câmera local pelo monuv_camera_id para vincular quadra e clube
    let courtId = null;
    let clubId = null;
    let localCameraId = null;

    if (monuvCameraId) {
      const { data: localCamera } = await supabase
        .from("cameras")
        .select("id, court_id, club_id, is_active")
        .eq("monuv_camera_id", monuvCameraId)
        .single();

      if (localCamera) {
        localCameraId = localCamera.id;
        courtId = localCamera.court_id;
        clubId = localCamera.club_id;

        // Atualizar status da câmera — heartbeat
        await supabase
          .from("cameras")
          .update({
            is_online: true,
            last_seen_at: new Date().toISOString(),
          })
          .eq("id", localCamera.id);
      }
    }

    // Salvar evento com vínculos
    const { error } = await supabase.from("camera_events").insert({
      event_id: event_id || null,
      camera_id: monuvCameraId,
      camera_name: camera_name || null,
      client_id: client_id || null,
      event_description: event_description || null,
      event_at: event_at ? new Date(event_at) : new Date(),
      event_url: event_url || null,
      event_thumb: event_thumb || null,
      local_camera_id: localCameraId,
      court_id: courtId,
      club_id: clubId,
      raw_data: body,
    });

    if (error) {
      console.error("Erro ao salvar evento Monuv:", error);
      return NextResponse.json(
        { status: "error", message: "Erro ao salvar evento" },
        { status: 500 }
      );
    }

    console.log(
      `Evento Monuv: ${event_description} — ${camera_name} (monuv:${monuvCameraId}${localCameraId ? ` → local:${localCameraId}` : ""})`
    );

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Erro no webhook Monuv:", error);
    return NextResponse.json(
      { status: "error", message: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}

// GET para teste
export async function GET() {
  // Contar câmeras registradas localmente
  const { count } = await supabase
    .from("cameras")
    .select("id", { count: "exact", head: true })
    .not("monuv_camera_id", "is", null);

  return NextResponse.json({
    status: "ok",
    message: "Webhook Monuv courtida ativo",
    cameras_vinculadas: count || 0,
    timestamp: new Date().toISOString(),
  });
}
