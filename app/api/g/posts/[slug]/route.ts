import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/g/posts/[slug]
export async function GET(
    request: NextRequest,
    context: { params: { slug: string } }
) {
    try {
        const { slug } = context.params;
        const post = await prisma.post.findUnique({
            where: { slug },
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

        if (!post || !post.published) {
            return NextResponse.json(
                { success: false, message: "Post not found or unpublished" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: post,
        });
    } catch (error) {
        console.error("GET /g/posts/[slug] error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch post" },
            { status: 500 }
        );
    }
}