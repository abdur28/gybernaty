// app/api/auth/wiki-token/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { getAccessLevel } from '@/utils/accessLevels';
import { AccessLevel } from '@/types';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { address, balance } = await request.json();

        const user = await prisma.user.findUnique({
            where: { address: address.toLowerCase() }
        });

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Update access level based on current balance 
        const currentAccessLevel = getAccessLevel(balance) || "personal" as AccessLevel; // Remove personal in productions
        const groups = [currentAccessLevel.charAt(0).toUpperCase() + currentAccessLevel.slice(1)];

        // if (currentAccessLevel !== user.accessLevel) {
            await prisma.user.update({
                where: { id: user.id },
                data: { accessLevel: currentAccessLevel }
            });
        // }

        const wikiToken = jwt.sign({
            sub: user.id,
            email: `${user.username}@gyber.org`,
            name: user.username,
            groups,
            iss: 'urn:gyber.org',
            aud: 'urn:gyber.org'
        }, process.env.WIKI_JWT_SECRET!, {
            expiresIn: '24h'
        });

        return NextResponse.json({ token: wikiToken });
    } catch (error) {
        console.error('Wiki token error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}