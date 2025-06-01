import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { postId, labelId } = body as { postId: string; labelId: string };

    const created = await prisma.postLabel.create({
      data: {
        postId,
        labelId,
      },
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error("Gagal assign label:", error);
    return NextResponse.json({ error: "Gagal assign label ke post" }, { status: 500 });
  }
}
