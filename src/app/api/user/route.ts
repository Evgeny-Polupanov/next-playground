import { getSession } from '@/shared';
import { cookies } from 'next/headers';
import { s3Client } from '~/lib/file-management';
import prisma from '~/lib/prisma';

export async function DELETE() {
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

    if (user.avatarUrl) {
        await s3Client.removeObject('avatars', user.avatarUrl);
    }

    await prisma.user.delete({ where: { id: user.id } });

    cookies().delete('session');

    return new Response('Successfully deleted user', { status: 200 });
}
