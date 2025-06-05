// app/api/g/labels/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const labels = await prisma.label.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: labels });
  } catch (error) {
    console.error("Error fetching labels:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch labels" },
      { status: 500 }
    );
  }
}
