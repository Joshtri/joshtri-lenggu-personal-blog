import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { labelIds } = await req.json(); // array of label ID

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        labels: {
          set: [], // clear existing
          connect: labelIds.map((id: string) => ({ id })),
        },
      },
      include: {
        labels: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Gagal assign label:", error);
    return NextResponse.json({ error: 'Failed to assign labels' }, { status: 500 });
  }
}
