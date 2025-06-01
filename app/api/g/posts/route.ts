import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // pastikan path ini sesuai

// GET /api/g/posts
export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            where: {
                published: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                labels: {
                    include: {
                        label: true,
                    },
                },
                comments: true,
                Like: true,
                Bookmark: true,
                Reaction: true,
                PostView: true,
            },
        });

        return NextResponse.json({
            success: true,
            data: posts,
        });
    } catch (error) {
        console.error("GET /g/posts error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}
