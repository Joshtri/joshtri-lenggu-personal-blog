import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId) {
        return NextResponse.json({ error: 'Missing postId parameter' }, { status: 400 });
    }

    try {
        const comments = await prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: 'asc' },
            include: {
                author: true, // include optional user info
            },
        });

        return NextResponse.json(comments); // even if empty, return 200 OK
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}