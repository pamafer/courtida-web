import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MONUV_BASE_URL = "https://app.monuv.com.br";
const MONUV_TOKEN = process.env.MONUV_API_TOKEN;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  if (!MONUV_TOKEN) {
    return NextResponse.json(
      { error: "Token da Monuv não configurado" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    switch (action) {
      case "cameras": {
        const page = searchParams.get("page") || "1";
        const res = await fetch(
          `${MONUV_BASE_URL}/api/v4/cameras?token=${MONUV_TOKEN}&page=${page}&p=hls`
        );
        const monuvData = await res.json();

        // Enriquecer com dados locais da tabela cameras
        if (monuvData?.cameras && Array.isArray(monuvData.cameras)) {
          const monuvIds = monuvData.cameras.map((c: { id: string | number }) => String(c.id));

          const { data: localCameras } = await supabase
            .from("cameras")
            .select("id, monuv_camera_id, name, court_id, club_id, is_active")
            .in("monuv_camera_id", monuvIds);

          // Mapa para lookup rápido
          const localMap = new Map(
            (localCameras || []).map((c) => [c.monuv_camera_id, c])
          );

          monuvData.cameras = monuvData.cameras.map((cam: { id: string | number; name?: string }) => ({
            ...cam,
            local: localMap.get(String(cam.id)) || null,
          }));
        }

        return NextResponse.json(monuvData);
      }

      case "camera": {
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID da câmera obrigatório" }, { status: 400 });
        const res = await fetch(
          `${MONUV_BASE_URL}/api/camera-player/${id}?token=${MONUV_TOKEN}`
        );
        const data = await res.json();
        return NextResponse.json(data);
      }

      case "recordings": {
        const id = searchParams.get("id");
        const digest = searchParams.get("digest");
        const timestamp = searchParams.get("timestamp") || "";
        if (!id || !digest) {
          return NextResponse.json({ error: "ID e digest obrigatórios" }, { status: 400 });
        }
        const url = `${MONUV_BASE_URL}/cameras/${id}/recordings/?token=${MONUV_TOKEN}&digest=${digest}${timestamp ? `&timeStamp=${timestamp}` : ""}`;
        const res = await fetch(url);
        const data = await res.json();
        return NextResponse.json(data);
      }

      case "live-url": {
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID da câmera obrigatório" }, { status: 400 });
        const res = await fetch(
          `${MONUV_BASE_URL}/api/cameras/${id}/live-url/?token=${MONUV_TOKEN}`
        );
        const data = await res.json();
        return NextResponse.json(data);
      }

      case "player": {
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID da câmera obrigatório" }, { status: 400 });
        const res = await fetch(
          `${MONUV_BASE_URL}/api/camera/${id}/player?token=${MONUV_TOKEN}&footer=1&controls=1`
        );
        const html = await res.text();
        return new NextResponse(html, {
          headers: { "Content-Type": "text/html" },
        });
      }

      case "snapshot": {
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID da câmera obrigatório" }, { status: 400 });
        const res = await fetch(
          `${MONUV_BASE_URL}/api/v1/cameras/${id}/print?token=${MONUV_TOKEN}`
        );
        const data = await res.json();
        return NextResponse.json(data);
      }

      case "sync": {
        // Sincronizar câmeras Monuv com tabela local cameras
        const res = await fetch(
          `${MONUV_BASE_URL}/api/v4/cameras?token=${MONUV_TOKEN}&p=hls`
        );
        const monuvData = await res.json();

        if (!monuvData?.cameras) {
          return NextResponse.json({ error: "Sem câmeras na Monuv" }, { status: 404 });
        }

        let synced = 0;
        let created = 0;

        for (const cam of monuvData.cameras) {
          const monuvId = String(cam.id);

          // Verificar se já existe na tabela cameras
          const { data: existing } = await supabase
            .from("cameras")
            .select("id")
            .eq("monuv_camera_id", monuvId)
            .single();

          if (existing) {
            // Atualizar status
            await supabase
              .from("cameras")
              .update({
                is_online: cam.status === "online",
                snapshot_url: cam.snapshot || null,
                last_seen_at: new Date().toISOString(),
              })
              .eq("id", existing.id);
            synced++;
          } else {
            // Criar câmera nova (sem vínculo a quadra/clube — será vinculada no CRUD)
            await supabase.from("cameras").insert({
              name: cam.name || `Câmera ${monuvId}`,
              monuv_camera_id: monuvId,
              is_online: cam.status === "online",
              snapshot_url: cam.snapshot || null,
              stream_url: cam.hls_url || null,
              is_active: true,
              last_seen_at: new Date().toISOString(),
            });
            created++;
          }
        }

        return NextResponse.json({
          status: "ok",
          message: `Sincronização concluída: ${synced} atualizadas, ${created} criadas`,
          total_monuv: monuvData.cameras.length,
          synced,
          created,
        });
      }

      default:
        return NextResponse.json(
          { error: "Ação inválida. Use: cameras, camera, recordings, live-url, player, snapshot, sync" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Erro na API Monuv:", error);
    return NextResponse.json(
      { error: "Erro ao comunicar com a Monuv" },
      { status: 500 }
    );
  }
}
