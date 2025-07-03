// app/api/speakers/[id]/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const { data, error } = await supabase.from("speaker").select("*").eq("id", id).single();

  if (error) {
    console.error("DB 호출 실패:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Speaker not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
