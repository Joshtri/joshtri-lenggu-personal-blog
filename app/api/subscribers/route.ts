import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { generateVerificationToken } from '@/lib/token';

// GET /api/subscribers
export async function GET() {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(subscribers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/subscribers
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already subscribed' }, { status: 409 });
    }

    const verificationToken = generateVerificationToken(); // ✅ custom token

    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        name,
        verificationToken,
      },
    });

    // You can send verification email with this token

    return NextResponse.json({
      message: 'Subscription created. Please verify your email.',
      subscriber,
      verificationToken,
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
