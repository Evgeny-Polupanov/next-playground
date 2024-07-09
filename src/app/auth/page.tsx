import { Metadata } from 'next';
import prisma from '~/lib/prisma';

export const metadata: Metadata = {
    title: 'Authentication',
};

const getData = async () => {
    const users = await prisma.user.findMany();

    return { users };
};

export default async function AuthPage() {
    const { users } = await getData();
    return (
        <>
            <h1>Hi there!</h1>
            {users.map((u) => (
                <h2 key={u.id}>{u.email}</h2>
            ))}
        </>
    );
}
