import prisma from '@/lib/prisma'; // adjust if your Prisma client path differs
import { NextResponse } from 'next/server';
import { uploadImageToFirebase } from '@/lib/firebase/upload'

// GET /api/posts
export async function GET() {
    const posts = await prisma.post.findMany({
        include: {
            labels: true,
            comments: true,
            Like: true,
            PostView: true,
            Bookmark: true,
            Reaction: true,
        },
        orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
}

// POST /api/posts
export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    const imageFile = formData.get('image') as File | null

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Field required' }, { status: 400 })
    }

    let imageUrl: string | null = null

    if (imageFile) {
      try {
        const uploaded = await uploadImageToFirebase(imageFile, 'post-thumbnails')
        imageUrl = uploaded.url
      } catch (err) {
        console.warn('Upload gagal, lanjut tanpa gambar:', err)
      }
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        published: false,
        coverImage: imageUrl,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Post creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}