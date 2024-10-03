'use server';

import { FormState, parseZodErrors } from '@/shared';
import { revalidatePath } from 'next/cache';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { createBucketIfNotExists, s3Client } from '~/lib/file-management';
import prisma from '~/lib/prisma';

const saveCategorySchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, { message: 'Title must be at least 1 character long' })
        .max(255, { message: "Title can't exceed 255 characters" }),
    image: z.any().nullable(),
});

export const onAdminSaveCategory = async (
    prevState: FormState,
    data: FormData,
) => {
    const checkedPayload = Object.fromEntries(data.entries()) as Record<
        string,
        string | number
    >;

    const state = saveCategorySchema.safeParse(checkedPayload);
    if (!state.success) {
        return parseZodErrors(state);
    }

    const id = data.get('id')?.toString();

    let imageUrl = null;
    const image = data.get('image') as File;
    if (image.size) {
        await createBucketIfNotExists('categories');
        imageUrl = `${uuid()}.${image.name.split('.').pop()}`;
        const arrayBuffer = await image.arrayBuffer();
        await s3Client.putObject(
            'categories',
            imageUrl,
            Buffer.from(arrayBuffer),
        );
    }

    try {
        const title = data.get('title')?.toString() ?? '';
        if (id) {
            await prisma.category.update({
                data: {
                    title,
                    imageUrl,
                },
                where: { id },
            });
        } else {
            await prisma.category.create({
                data: {
                    title,
                    imageUrl,
                },
            });
        }
    } catch (e) {
        console.error(e);
        return prevState;
    }
    revalidatePath('/admin/categories', 'page');
    return { status: 200 };
};
