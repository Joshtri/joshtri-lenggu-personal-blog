import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const label = await prisma.label.findUnique({
            where: { id: params.id },
            include: { posts: true },
        });

        if (!label) {
            return NextResponse.json({ error: "Label not found" }, { status: 404 });
        }

        return NextResponse.json(label);
    } catch (error) {
        console.error("GET /api/labels/[id] error:", error);
        return NextResponse.json({ error: "Failed to fetch label" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { name, description } = await req.json();

        const updated = await prisma.label.update({
            where: { id: params.id },
            data: { name, description },
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        console.error("PATCH /api/labels/[id] error:", error);
        if (error.code === "P2025") {
            return NextResponse.json({ error: "Label not found" }, { status: 404 });
        }
        return NextResponse.json({ error: "Update failed" }, { status: 400 });
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.label.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Label deleted successfully" });
    } catch (error: any) {
        console.error("DELETE /api/labels/[id] error:", error);
        if (error.code === "P2025") {
            return NextResponse.json({ error: "Label not found" }, { status: 404 });
        }
        return NextResponse.json({ error: "Delete failed" }, { status: 400 });
    }
}
