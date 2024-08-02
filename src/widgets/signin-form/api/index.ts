'use server';

import { FormState } from '@/shared';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import prisma from '~/lib/prisma';

const key = new TextEncoder().encode('secret');

const encrypt = async (payload: any) =>
    await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(Date.now() + 60 * 60 * 24 * 7 * 1000)
        .sign(key);

export const onLogin = async (prevState: FormState, data: FormData) => {
    try {
        const existingUser = await prisma.user.findFirst({
            where: { email: data.get('email')?.toString() },
        });

        let isValid = false;
        if (existingUser) {
            isValid = await bcrypt.compare(
                data.get('password') as string,
                existingUser.password,
            );
        }

        if (!existingUser || !isValid) {
            return { login: 'Invalid credentials' };
        }

        const user = {
            email: existingUser.email,
        };

        const expires = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);
        const session = await encrypt({ user, expires });

        cookies().set('session', session, { expires, httpOnly: true });

        return { status: 200 };
    } catch (e) {
        console.error(e);
        return prevState;
    }
};
