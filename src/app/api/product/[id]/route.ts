import { getSession } from '@/shared';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { s3Client } from '~/lib/file-management';
import prisma from '~/lib/prisma';

export async function DELETE(
    _: NextRequest,
    { params }: { params: { id: string } },
) {
    const session = await getSession(true);

    if (!session) {
        return new Response('Unauthorized', { status: 401 });
    }

    if (!session.user.isAdmin) {
        return new Response('Forbidden', { status: 403 });
    }

    const { id } = params;

    const product = await prisma.product.findFirst({ where: { id } });

    if (!product) {
        return new Response('Not found', { status: 404 });
    }

    const image = product?.imageUrl;
    if (image) {
        await s3Client.removeObject('products', image);
    }

    await prisma.product.delete({ where: { id } });

    revalidatePath('/admin/products', 'page');

    return NextResponse.json({ deleted: true }, { status: 200 });
}
