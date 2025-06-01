import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/users
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/users
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email } = body;

        if (!name || !email) {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
            },
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
