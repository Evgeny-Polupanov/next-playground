'use server';

import { FormState } from './types';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import internal from 'stream';

export const parseZodErrors = (state: any) => {
    const errObj = state.error.format();
    return Object.keys(errObj).reduce((acc, key) => {
        acc[key] = errObj[key]._errors?.join(', ');
        return acc;
    }, {} as FormState);
};

const key = new TextEncoder().encode(process.env.SECRET);

const decrypt = async (session: string) => {
    try {
        return await jwtVerify(session, key, { algorithms: ['HS256'] });
    } catch (e) {
        console.error(e);
        return { payload: null };
    }
};

export const getSession = async () => {
    const session = cookies().get('session')?.value;
    if (!session) {
        return null;
    }
    const { payload } = await decrypt(session);

    return payload;
};

export const getAvatarByFile = async (avatarFile: internal.Readable) => {
    const avatar = await new Promise((resolve) => {
        const chunks: Uint8Array[] = [];
        avatarFile.on('data', (chunk) => {
            chunks.push(chunk);
        });
        avatarFile.on('end', () => {
            const result = Buffer.concat(chunks).toString('base64');
            resolve(`data:image/jpeg;base64,${result}`);
        });
    });

    return avatar as string;
};
