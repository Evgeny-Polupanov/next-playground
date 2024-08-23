'use server';

import { FormState, parseZodErrors } from '@/shared';
import { User } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import prisma from '~/lib/prisma';

const saveUserSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, { message: 'First name must be at least 1 character long' })
        .max(40, { message: "First name can't exceed 40 characters" }),
    lastName: z
        .string()
        .trim()
        .min(1, { message: 'Last name must be at least 1 character long' })
        .max(40, { message: "Last name can't exceed 40 characters" }),
    email: z.string().email({ message: 'Enter a valid email address' }),
    bio: z.string(),
    balance: z
        .number()
        .int()
        .min(0, 'Balance must be greater or equal to zero'),
});

export const onAdminSaveUser = async (prevState: FormState, data: FormData) => {
    const checkedPayload = Object.fromEntries(data.entries()) as Record<
        string,
        string | number
    >;

    if (typeof checkedPayload.balance === 'string') {
        checkedPayload.balance = parseInt(checkedPayload.balance);
    }

    const state = saveUserSchema.safeParse(checkedPayload);
    if (!state.success) {
        return parseZodErrors(state);
    }

    const errors: FormState = {};

    try {
        const id = data.get('id')?.toString();
        const firstName = data.get('firstName')?.toString();
        const lastName = data.get('lastName')?.toString();
        const email = data.get('email')?.toString();
        const bio = data.get('bio')?.toString().trim() ?? '';
        const balance = +data.get('balance')?.valueOf()!;
        const isAdmin = data.get('isAdmin')?.toString() === 'on';

        const payload: Partial<User> = {
            firstName,
            lastName,
            bio,
            isAdmin,
            balance,
        };

        const emailOwner = await prisma.user.findFirst({ where: { email } });
        if (emailOwner && emailOwner.id !== id) {
            errors.email = 'This email is already taken';
        } else {
            payload.email = email;
        }

        if (Object.keys(errors).length > 0) {
            return errors;
        }

        await prisma.user.update({
            data: payload,
            where: { id },
        });
    } catch (e) {
        console.error(e);
        return prevState;
    }
    revalidatePath('/admin', 'page');
    return { status: 200 };
};
