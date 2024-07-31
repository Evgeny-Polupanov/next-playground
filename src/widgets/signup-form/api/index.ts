'use server';

import { parseZodErrors } from '@/shared';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import { Stream } from 'stream';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { createBucketIfNotExists, s3Client } from '~/lib/file-management';
import prisma from '~/lib/prisma';

const createUserSchema = z
    .object({
        firstName: z
            .string()
            .min(1, { message: 'First name must be at least 1 character long' })
            .max(40, { message: "First name can't exceed 40 characters" }),
        lastName: z
            .string()
            .min(1, { message: 'Last name must be at least 1 character long' })
            .max(40, { message: "Last name can't exceed 40 characters" }),
        email: z.string().email({ message: 'Enter a valid email address' }),
        password: z
            .string()
            .min(1, { message: 'Password must be at least 1 character long' }),
        passwordConfirm: z
            .string()
            .min(1, { message: 'Password must be at least 1 character long' }),
        avatar: z.any().optional().nullable(),
        bio: z.string().optional().nullable(),
    })
    .superRefine(({ password, passwordConfirm }, ctx) => {
        if (password !== passwordConfirm) {
            ctx.addIssue({
                code: 'custom',
                message: "Passwords don't match",
                path: ['passwordConfirm'],
            });
        }
    });

export const onCreateUser = async (_: any, data: FormData) => {
    const checkedPayload = Object.fromEntries(data.entries());
    const state = createUserSchema.safeParse(checkedPayload);
    if (!state.success) {
        return parseZodErrors(state);
    }

    const errors: Record<string, string> = {};

    try {
        const existingUser = await prisma.user.findFirst({
            where: { email: data.get('email')?.toString() },
        });

        if (existingUser) {
            errors.email = 'This email is already taken';
        }

        const hashedPassword = await bcrypt.hash(
            data.get('password') as string,
            10,
        );

        let avatarUrl = null;
        const avatar = data.get('image') as File | null;
        if (avatar) {
            await createBucketIfNotExists('avatars');
            avatarUrl = `${uuid()}.${avatar.name.split('.').reverse()[0]}`;
            const arrayBuffer = await avatar.arrayBuffer();
            await s3Client.putObject(
                'avatars',
                avatarUrl,
                Buffer.from(arrayBuffer),
            );
        }

        if (Object.keys(errors).length > 0) {
            return errors;
        }

        await prisma.user.create({
            data: {
                firstName: data.get('firstName')?.toString() ?? '',
                lastName: data.get('lastName')?.toString() ?? '',
                email: data.get('email')?.toString() ?? '',
                password: hashedPassword,
                avatarUrl,
                bio: data.get('bio')?.toString() ?? '',
                balance: 0,
            },
        });
    } catch (e) {
        console.error(e);
        return;
    }
    redirect('/signin');
};
