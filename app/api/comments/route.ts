import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/comments?postId=xxx
export async function GET() {
    try {
        const comments = await prisma.comment.findMany({
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



// POST /api/comments
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { postId, content, authorId, guestName, guestEmail } = body;

        if (!postId || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newComment = await prisma.comment.create({
            data: {
                postId,
                content,
                authorId,
                guestName,
                guestEmail,
            },
        });

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
