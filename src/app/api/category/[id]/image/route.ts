import { getSession } from '@/shared';
import { NextRequest, NextResponse } from 'next/server';
import { s3Client } from '~/lib/file-management';
import prisma from '~/lib/prisma';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    const session = await getSession(true);

    if (!session) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { id } = params;

    const category = await prisma.category.findFirst({ where: { id } });

    if (!category) {
        return new Response('Not found', { status: 404 });
    }

    const image = category?.imageUrl
        ? await s3Client.presignedGetObject('categories', category.imageUrl)
        : '';

    return NextResponse.json({ url: image }, { status: 200 });
}
