import { getSession } from '@/shared';
import { NextResponse } from 'next/server';
import prisma from '~/lib/prisma';

export async function GET() {
    const session = await getSession(true);

    if (!session) {
        return new Response('Unauthorized', { status: 401 });
    }

    if (!session.user.isAdmin) {
        return new Response('Forbidden', { status: 403 });
    }

    const categories = await prisma.category.findMany();

    return NextResponse.json(
        categories.map((c) => ({ id: c.id, title: c.title })),
        { status: 200 },
    );
}
