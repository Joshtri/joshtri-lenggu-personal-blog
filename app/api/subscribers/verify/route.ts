import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// PATCH /api/subscribers/verify
export async function PATCH(req: Request) {
    try {
        const { token } = await req.json();
        if (!token) {
            return NextResponse.json({ error: 'Verification token is required' }, { status: 400 });
        }

        const subscriber = await prisma.subscriber.updateMany({
            where: {
                verificationToken: token,
                verified: false,
            },
            data: {
                verified: true,
                verifiedAt: new Date(),
                verificationToken: null,
            },
        });

        if (subscriber.count === 0) {
            return NextResponse.json({ error: 'Invalid or already verified token' }, { status: 400 });
        }

        return NextResponse.json({ message: 'Subscriber verified successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
