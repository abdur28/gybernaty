// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAccessLevel, ACCESS_LEVELS } from '@/utils/accessLevels';
import { AccessLevel } from '@/types';

const prisma = new PrismaClient();


export async function POST(request: Request) {
    try {
        const { address, username, balance } = await request.json();

        if (balance < ACCESS_LEVELS.PERSONAL.min) {
            return NextResponse.json(
                { message: 'Insufficient GBR balance for registration' },
                { status: 400 }
            );
        }

        const accessLevel = getAccessLevel(balance) as AccessLevel;

        // const accessLevel = getAccessLevel(ACCESS_LEVELS.PERSONAL.min) as AccessLevel;

        const user = await prisma.user.create({
            data: {
                address: address.toLowerCase(),
                username,
                accessLevel
            }
        });

        console.log(user);

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Failed to create user' },
            { status: 500 }
        );
    }
}