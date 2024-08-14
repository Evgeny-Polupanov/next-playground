'use server';

import { FormState, getSession, parseZodErrors } from '@/shared';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { createBucketIfNotExists, s3Client } from '~/lib/file-management';
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
    password: z.string(),
    newPassword: z.string(),
    newPasswordConfirm: z.string(),
    avatar: z.any().optional().nullable(),
    bio: z.string().optional(),
});

export const onSaveUser = async (prevState: FormState, data: FormData) => {
    const session = await getSession();

    const checkedPayload = Object.fromEntries(data.entries());
    const state = saveUserSchema.safeParse(checkedPayload);
    if (!state.success) {
        return parseZodErrors(state);
    }

    const errors: FormState = {};

    let user;

    try {
        user = await prisma.user.findFirst({
            where: { id: session?.user.id },
        });
    } catch (e) {
        console.error(e);
        redirect('signin');
    }

    if (!user) {
        redirect('/signin');
    }

    try {
        const firstName = data.get('firstName')?.toString();
        const lastName = data.get('lastName')?.toString();
        const email = data.get('email')?.toString();
        const bio = data.get('bio')?.toString() ?? '';

        const oldPassword = data.get('password')?.toString().trim();
        const newPassword = data.get('newPassword')?.toString().trim();
        const newPasswordConfirm = data
            .get('newPasswordConfirm')
            ?.toString()
            .trim();

        const avatar = data.get('avatar') as File;

        const payload: Partial<User> = {
            firstName,
            lastName,
            email,
            bio,
        };

        if (oldPassword || newPassword || newPasswordConfirm) {
            if (!oldPassword) {
                errors.password =
                    'To change the password enter the current one';
            } else {
                const isValid = await bcrypt.compare(
                    oldPassword,
                    user.password,
                );
                if (isValid) {
                    if (
                        newPassword &&
                        newPasswordConfirm &&
                        newPassword === newPasswordConfirm
                    ) {
                        payload.password = await bcrypt.hash(newPassword, 10);
                    } else if (!newPassword || !newPasswordConfirm) {
                        errors.newPasswordConfirm =
                            'Enter a new password and its confirmation';
                    } else if (newPassword !== newPasswordConfirm) {
                        errors.newPasswordConfirm =
                            "The new passwords don't match";
                    }
                } else {
                    errors.password = 'Incorrect old password';
                }
            }
        }

        if (data.get('isImageDirty')?.valueOf() === 'true') {
            if (user.avatarUrl) {
                await s3Client.removeObject('avatars', user.avatarUrl);
            }
            if (!avatar.size) {
                if (user.avatarUrl) {
                    payload.avatarUrl = null;
                }
            } else {
                await createBucketIfNotExists('avatars');
                payload.avatarUrl = `${uuid()}.${avatar.name.split('.').pop()}`;
                const arrayBuffer = await avatar.arrayBuffer();
                await s3Client.putObject(
                    'avatars',
                    payload.avatarUrl,
                    Buffer.from(arrayBuffer),
                );
            }
        }

        if (Object.keys(errors).length > 0) {
            return errors;
        }

        await prisma.user.update({
            data: payload,
            where: { id: user.id },
        });
    } catch (e) {
        console.error(e);
        return prevState;
    }
    revalidatePath('/profile', 'layout');
    return { status: 200 };
};
