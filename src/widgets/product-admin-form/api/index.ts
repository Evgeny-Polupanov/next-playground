'use server';

import { FormState, parseZodErrors } from '@/shared';
import { revalidatePath } from 'next/cache';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { createBucketIfNotExists, s3Client } from '~/lib/file-management';
import prisma from '~/lib/prisma';

const saveProductSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, { message: 'Title must be at least 1 character long' })
        .max(255, { message: "Title can't exceed 255 characters" }),
    category: z.string().optional(),
    description: z
        .string()
        .trim()
        .min(1, { message: 'Title must be at least 1 character long' })
        .max(255, { message: "Title can't exceed 255 characters" }),
    image: z.any().nullable(),
    price: z.number().int().min(1, 'Price must be greater than zero'),
    count: z
        .number()
        .int()
        .min(0, 'Count must be greater than or equal to zero'),
});

export const onAdminSaveProduct = async (
    prevState: FormState,
    data: FormData,
) => {
    const checkedPayload = Object.fromEntries(data.entries()) as Record<
        string,
        string | number
    >;

    if (typeof checkedPayload.price === 'string') {
        checkedPayload.price = parseInt(checkedPayload.price);
    }
    if (typeof checkedPayload.count === 'string') {
        checkedPayload.count = parseInt(checkedPayload.count);
    }

    const state = saveProductSchema.safeParse(checkedPayload);
    if (!state.success) {
        return parseZodErrors(state);
    }

    const id = data.get('id')?.toString();

    let imageUrl;
    const image = data.get('image') as File;
    if (data.get('isImageDirty')?.valueOf() === 'true') {
        const product = await prisma.product.findFirst({ where: { id } });
        if (product?.imageUrl) {
            await s3Client.removeObject('products', product.imageUrl);
        }
        if (!image.size) {
            imageUrl = null;
        } else {
            await createBucketIfNotExists('products');
            imageUrl = `${uuid()}.${image.name.split('.').pop()}`;
            const arrayBuffer = await image.arrayBuffer();
            await s3Client.putObject(
                'products',
                imageUrl,
                Buffer.from(arrayBuffer),
            );
        }
    }

    try {
        const title = data.get('title')?.toString() ?? '';
        const description = data.get('description')?.toString() ?? '';
        const price = +data.get('price')?.valueOf()!;
        const count = +data.get('count')?.valueOf()!;
        const categoryId = data.get('category')?.toString() || null;

        if (id) {
            await prisma.product.update({
                data: {
                    title,
                    categoryId,
                    description,
                    imageUrl,
                    price,
                    count,
                },
                where: { id },
            });
        } else {
            await prisma.product.create({
                data: {
                    title,
                    categoryId,
                    description,
                    imageUrl,
                    price,
                    count,
                },
            });
        }
    } catch (e) {
        console.error(e);
        return prevState;
    }
    revalidatePath('/admin/products', 'page');
    return { status: 200 };
};
