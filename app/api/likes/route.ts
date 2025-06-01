import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET() {

    try {
        const likes = await prisma.like.findMany({
            orderBy: { createdAt: 'asc' },
            include: {
                user: true, // include optional user info
                post: true, // include optional post info
            },
        });

        return NextResponse.json(likes); // even if empty, return 200 OK
    } catch (error) {
        console.error('Error fetching likes:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}