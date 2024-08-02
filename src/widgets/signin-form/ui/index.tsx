'use client';

import { onLogin } from '../api';
import { ErrorLabel } from '@/features';
import { FormState, SubmitButton } from '@/shared';
import Link from 'next/link';
import { RedirectType, redirect } from 'next/navigation';
import { FC, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

const SigninFields: FC<{ state: FormState }> = ({ state }) => {
    const { pending } = useFormStatus();

    return (
        <>
            <input
                name="email"
                className="bg-transparent"
                type="email"
                placeholder="Enter your email"
                required
                disabled={pending}
            />
            <input
                name="password"
                className="bg-transparent"
                type="password"
                placeholder="Enter your password"
                required
                disabled={pending}
            />
            <ErrorLabel error={state.login} />
        </>
    );
};

export const SigninForm = () => {
    const [state, action] = useFormState<FormState, FormData>(onLogin, {
        login: '',
    });

    useEffect(() => {
        if (state.status === 200) {
            alert('Success!');
            redirect('/', RedirectType.push);
        }
    }, [state]);

    return (
        <form className="flex flex-col gap-4 w-96" action={action}>
            <SigninFields state={state} />
            <div className="flex justify-between items-center">
                <SubmitButton>Sign in</SubmitButton>
                <Link href="/signup">
                    <button type="button">Sign up</button>
                </Link>
            </div>
        </form>
    );
};
