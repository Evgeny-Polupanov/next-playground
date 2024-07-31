import { SignupForm } from '@/widgets';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Registration',
};

export default async function AuthPage() {
    return (
        <main className="m-auto">
            <h1 className="mb-8 text-3xl">Sign Up</h1>
            <SignupForm />
        </main>
    );
}
