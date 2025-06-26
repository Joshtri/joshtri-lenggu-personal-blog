import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { z } from "zod";
import prisma from "@/lib/prisma";
// const prisma = new PrismaClient();

// Input validation schema
const loginSchema = z.object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
});

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();

        // Validate input
        const validationResult = loginSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    message: "Validation error",
                    errors: validationResult.error.format()
                },
                { status: 400 }
            );
        }

        const { email, password } = validationResult.data;

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                role: true,
            },
        });

        // Check if user exists
        if (!user) {
            return NextResponse.json(
                { message: "Email atau password tidak valid" },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Email atau password tidak valid" },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
            },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "7d" }
        );

        // Create the response object first
        const response = NextResponse.json({
            message: "Login berhasil",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role, // Add this line
            },
        });

        // Set the cookie on the response object
        response.cookies.set({
            name: "auth-token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "Terjadi kesalahan pada server" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}