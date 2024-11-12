'use server';

import { FormState } from './types';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const parseZodErrors = async (state: any) => {
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

export const getSession = async (isForApi = false) => {
    const session = cookies().get('session')?.value;
    if (!session) {
        if (isForApi) {
            return null;
        }
        redirect('/signin');
    }
    const { payload } = await decrypt(session);

    if (!payload) {
        if (isForApi) {
            return null;
        }
        redirect('/signin');
    }

    return payload as { user: { id: string; email: string; isAdmin: boolean } };
};
