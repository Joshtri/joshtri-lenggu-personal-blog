import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/users/:id
export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: params.id },
            include: {
                comments: true,
                Like: true,
                Bookmark: true,
                Reaction: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT /api/users/:id
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { name, email } = body;

        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: { name, email },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

// DELETE /api/users/:id
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.user.delete({ where: { id: params.id } });
        return NextResponse.json({ message: 'User deleted' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
