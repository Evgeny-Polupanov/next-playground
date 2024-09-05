'use server';

import { FormState, parseZodErrors } from '@/shared';
import { User } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import prisma from '~/lib/prisma';

const saveCategorySchema = z.object({
    id: z.string().uuid('ID is incorrect').nullable(),
    title: z
        .string()
        .trim()
        .min(1, { message: 'Title must be at least 1 character long' })
        .max(255, { message: "Title can't exceed 255 characters" }),
    image: z.any().nullable(),
    productIds: z.array(z.string().uuid('ID is incorrect')),
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

    const errors: FormState = {};

    try {
        // const id = data.get('id')?.toString();
        // const firstName = data.get('firstName')?.toString();
        // const lastName = data.get('lastName')?.toString();
        // const bio = data.get('bio')?.toString().trim() ?? '';
        // const balance = +data.get('balance')?.valueOf()!;
        // const isAdmin = data.get('isAdmin')?.toString() === 'on';
        // const payload: Partial<User> = {
        //     firstName,
        //     lastName,
        //     bio,
        //     isAdmin,
        //     balance,
        // };
        // if (Object.keys(errors).length > 0) {
        //     return errors;
        // }
        // await prisma.user.update({
        //     data: payload,
        //     where: { id },
        // });
    } catch (e) {
        console.error(e);
        return prevState;
    }
    revalidatePath('/admin/categories', 'page');
    return { status: 200 };
};
