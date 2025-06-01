import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const post = await prisma.post.findUnique({
            where: { id: params.id },
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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { title, slug, content, excerpt, published } = body;

        const updated = await prisma.post.update({
            where: { id: params.id },
            data: {
                title,
                slug,
                content,
                excerpt,
                published,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.post.delete({ where: { id: params.id } });
        return NextResponse.json({ message: 'Post deleted' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}


export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();

    const updated = await prisma.post.update({
      where: { id: params.id },
      data: {
        // hanya update field yang dikirim
        ...(body.title !== undefined && { title: body.title }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
        ...(body.published !== undefined && { published: body.published }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}