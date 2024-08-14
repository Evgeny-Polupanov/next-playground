'use client';

import { onSaveUser } from '../api';
import { ErrorLabel } from '@/features';
import { UploadImage } from '@/features';
import { FormState } from '@/shared';
import { SubmitButton } from '@/shared';
import Link from 'next/link';
import { FC, useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

interface UserFields {
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    bio: string;
}

const ProfileFields: FC<{ state: FormState; user: UserFields }> = ({
    state,
    user,
}) => {
    const { pending } = useFormStatus();

    const passwordRef = useRef<HTMLInputElement | null>(null);
    const newPasswordRef = useRef<HTMLInputElement | null>(null);
    const newPasswordConfirmRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (
            state.status === 200 &&
            passwordRef.current &&
            newPasswordRef.current &&
            newPasswordConfirmRef.current
        ) {
            passwordRef.current.value = '';
            newPasswordRef.current.value = '';
            newPasswordConfirmRef.current.value = '';
        }
    }, [state]);

    return (
        <div className="w-96 flex flex-col gap-4">
            <label>Personal data</label>
            <input
                name="firstName"
                className="bg-transparent"
                type="text"
                maxLength={40}
                placeholder="Enter your first name"
                required
                disabled={pending}
                defaultValue={user.firstName}
            />
            <ErrorLabel error={state.firstName} />
            <input
                name="lastName"
                className="bg-transparent"
                type="text"
                maxLength={40}
                placeholder="Enter your last name"
                defaultValue={user.lastName}
                required
                disabled={pending}
            />
            <ErrorLabel error={state.lastName} />
            <input
                name="email"
                className="bg-transparent"
                type="email"
                placeholder="Enter your email"
                defaultValue={user.email}
                required
                disabled={pending}
            />
            <ErrorLabel error={state.email} />
            <label>Password</label>
            <input
                name="password"
                className="bg-transparent"
                type="password"
                placeholder="Enter your current password"
                disabled={pending}
                ref={passwordRef}
            />
            <ErrorLabel error={state.password} />
            <input
                name="newPassword"
                className="bg-transparent"
                type="password"
                placeholder="Come up with a new password"
                disabled={pending}
                ref={newPasswordRef}
            />
            <ErrorLabel error={state.newPassword} />
            <input
                name="newPasswordConfirm"
                className="bg-transparent"
                type="password"
                placeholder="Confirm your new password"
                disabled={pending}
                ref={newPasswordConfirmRef}
            />
            <ErrorLabel error={state.newPasswordConfirm} />
            <label>Bio</label>
            <textarea
                name="bio"
                className="bg-transparent resize-none"
                placeholder="Enter your bio (optional)"
                maxLength={255}
                disabled={pending}
                defaultValue={user.bio}
            />
            <ErrorLabel error={state.bio} />
        </div>
    );
};

export const ProfileForm: FC<{
    user: UserFields;
}> = ({ user }) => {
    const [state, action] = useFormState<FormState, FormData>(onSaveUser, {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        newPassword: '',
        newPasswordConfirm: '',
        bio: '',
    });

    useEffect(() => {
        if (state.status === 200) {
            alert('Success!');
        }
    }, [state]);

    return (
        <form
            action={action}
            className="flex flex-col items-center justify-between p-24 flex-grow"
        >
            <div className="z-10 w-full max-w-5xl items-start justify-between font-mono text-sm lg:flex">
                <ProfileFields state={state} user={user} />
                <div>
                    <label>Avatar</label>
                    <UploadImage defaultValue={user.avatar} name="avatar" />
                </div>
            </div>
            <div className="flex justify-between items-center mt-4 max-w-5xl w-full">
                <SubmitButton>Save profile</SubmitButton>
                <Link href="/">Back to main page</Link>
            </div>
        </form>
    );
};
