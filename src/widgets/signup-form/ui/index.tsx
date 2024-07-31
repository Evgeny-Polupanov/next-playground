'use client';

import { onCreateUser } from '../api';
import { ErrorLabel, UploadImage } from '@/features';
import { SubmitButton } from '@/shared';
import Link from 'next/link';
import { FC } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

const SignupFields: FC<{ state: Record<string, string> }> = ({ state }) => {
    const { pending } = useFormStatus();

    return (
        <>
            <input
                name="firstName"
                className="bg-transparent"
                type="text"
                maxLength={40}
                placeholder="Enter your first name"
                required
                disabled={pending}
            />
            <ErrorLabel error={state?.firstName} />
            <input
                name="lastName"
                className="bg-transparent"
                type="text"
                maxLength={40}
                placeholder="Enter your last name"
                required
                disabled={pending}
            />
            <ErrorLabel error={state?.lastName} />
            <input
                name="email"
                className="bg-transparent"
                type="email"
                placeholder="Enter your email"
                required
                disabled={pending}
            />
            <ErrorLabel error={state?.email} />
            <input
                name="password"
                className="bg-transparent"
                type="password"
                placeholder="Come up with the password"
                required
                disabled={pending}
            />
            <ErrorLabel error={state?.password} />
            <input
                name="passwordConfirm"
                className="bg-transparent"
                type="password"
                placeholder="Confirm your password"
                required
                disabled={pending}
            />
            <ErrorLabel error={state?.passwordConfirm} />
            <UploadImage />
            <textarea
                name="bio"
                className="bg-transparent resize-none"
                placeholder="Enter your bio (optional)"
                maxLength={255}
                disabled={pending}
            />
            <ErrorLabel error={state?.bio} />
        </>
    );
};

export const SignupForm = () => {
    const [state, action] = useFormState<any, FormData>(onCreateUser, {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: '',
        avatar: '',
        bio: '',
    });

    return (
        <form
            className="flex flex-col gap-4 w-96"
            action={action}
            method="POST"
        >
            <SignupFields state={state} />
            <div className="flex justify-between items-center">
                <SubmitButton>Sign up</SubmitButton>
                <Link href="/signin">
                    <button type="button">Sign in instead...</button>
                </Link>
            </div>
        </form>
    );
};
