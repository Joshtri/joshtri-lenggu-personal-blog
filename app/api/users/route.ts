import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// GET /api/users
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
                // Exclude password for security
            }
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// User registration schema
const userSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter")
});

// POST /api/users - Register new user
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate input
        const validationResult = userSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json({
                error: 'Validation error',
                details: validationResult.error.format()
            }, { status: 400 });
        }

        const { name, email, password } = validationResult.data;

        // Check if email already exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                // Don't return the password in the response
            }
        });

        return NextResponse.json({
            message: 'Pendaftaran berhasil',
            user
        }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
    }
}