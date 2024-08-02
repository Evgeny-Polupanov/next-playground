import { SigninForm } from '@/widgets';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Authentication',
};

export default async function AuthPage() {
    return (
        <main className="m-auto">
            <h1 className="mb-8 text-3xl">Sign In</h1>
            <SigninForm />
        </main>
    );
}
