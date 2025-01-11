import { getSession } from '@/shared';
import { NextRequest } from 'next/server';
import prisma from '~/lib/prisma';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    const session = await getSession(true);
    if (!session) {
        return new Response('Unauthorized', { status: 401 });
    }

    const {
        user: { id, email },
    } = session as { user: { id: string; email: string } };

    const user = await prisma.user.findFirst({ where: { id, email } });
    if (!user) {
        return new Response('Not found', { status: 404 });
    }

    const chatee = await prisma.user.findFirst({
        where: { id: params.id },
    });
    if (!chatee) {
        return new Response('Not found', { status: 404 });
    }

    const data = await request.json();

    if (!data?.message || typeof data?.message !== 'string') {
        return new Response('Invalid message', { status: 400 });
    }

    await prisma.message.create({
        data: {
            senderId: user.id,
            receiverId: chatee.id,
            content: data.message,
        },
    });

    return new Response('Message sent', { status: 200 });
}
