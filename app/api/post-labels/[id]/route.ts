import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { postId, labelIds } = body as { postId: string; labelIds: string[] };

    const result = await prisma.$transaction([
      prisma.postLabel.deleteMany({ where: { postId } }),
      ...labelIds.map((labelId) =>
        prisma.postLabel.create({ data: { postId, labelId } })
      ),
    ]);

    return NextResponse.json({ message: "Labels updated", data: result });
  } catch (error) {
    console.error("Gagal update label:", error);
    return NextResponse.json({ error: "Gagal update label post" }, { status: 500 });
  }
}
