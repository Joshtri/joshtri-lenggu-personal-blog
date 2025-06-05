import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const { labelIds } = await req.json();

        // Clear existing PostLabel
        await prisma.postLabel.deleteMany({
            where: { postId: params.id },
        });

        // Re-connect with new labels
        const newRelations = labelIds.map((labelId: string) => ({
            postId: params.id,
            labelId,
        }));

        await prisma.postLabel.createMany({
            data: newRelations,
        });

        // Optional: return the updated labels
        const updatedPost = await prisma.post.findUnique({
            where: { id: params.id },
            include: { labels: true },
        });

        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error("Gagal assign label:", error);
        return NextResponse.json({ error: 'Failed to assign labels' }, { status: 500 });
    }
}
