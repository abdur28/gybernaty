import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { address } = await request.json();

        const user = await prisma.user.findUnique({
            where: { address: address.toLowerCase() }
        });
        console.log(user);

        return NextResponse.json({ exists: !!user });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}