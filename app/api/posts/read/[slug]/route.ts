import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/posts/slug/:slug
export async function GET(_: Request, { params }: { params: { slug: string } }) {
    try {
        const post = await prisma.post.findUnique({
            where: { slug: params.slug },
            include: {
                labels: true,
                comments: true,
                Like: true,
                PostView: true,
                Bookmark: true,
                Reaction: true,
            },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
