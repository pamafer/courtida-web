import { NextRequest, NextResponse } from "next/server";

const MONUV_BASE_URL = "https://app.monuv.com.br";
const MONUV_TOKEN = process.env.MONUV_API_TOKEN;

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
        const data = await res.json();
        return NextResponse.json(data);
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

      default:
        return NextResponse.json(
          { error: "Ação inválida. Use: cameras, camera, recordings, live-url, player, snapshot" },
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
