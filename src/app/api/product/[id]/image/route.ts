import { getSession } from '@/shared';
import { NextRequest, NextResponse } from 'next/server';
import { s3Client } from '~/lib/file-management';
import prisma from '~/lib/prisma';

export async function GET(
    _: NextRequest,
    { params }: { params: { id: string } },
) {
    const session = await getSession(true);

    if (!session) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { id } = params;

    const product = await prisma.product.findFirst({ where: { id } });

    if (!product) {
        return new Response('Not found', { status: 404 });
    }

    const image = product?.imageUrl
        ? await s3Client.presignedGetObject('products', product.imageUrl)
        : '';

    return NextResponse.json({ url: image }, { status: 200 });
}
