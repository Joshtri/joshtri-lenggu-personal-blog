import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/labels – Ambil semua label
export async function GET() {
  const labels = await prisma.label.findMany({
    orderBy: { createdAt: "desc" },
    include: { posts: true },
  });

  return NextResponse.json(labels);
}

// POST /api/labels – Buat label baru
export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newLabel = await prisma.label.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(newLabel, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      // duplicate unique constraint
      return NextResponse.json({ error: "Label name must be unique" }, { status: 409 });
    }
    console.error("POST /api/labels error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
