import { getSession } from '@/shared';
import { Footer, Header } from '@/widgets';
import { redirect } from 'next/navigation';
import React from 'react';
import { s3Client } from '~/lib/file-management';
import prisma from '~/lib/prisma';

const getData = async () => {
    const session = await getSession();

    const user = await prisma.user.findFirst({
        where: { id: session?.user.id },
    });

    if (!user) {
        redirect('/signin');
    }

    const { avatarUrl, isAdmin, email } = user;

    const avatar = avatarUrl
        ? await s3Client.presignedGetObject('avatars', avatarUrl)
        : '';

    return { avatar, isAdmin, email };
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { avatar, isAdmin, email } = await getData();

    return (
        <>
            <Header avatar={avatar} isAdmin={isAdmin} />
            <main className="flex-grow">{children}</main>
            <Footer email={email} />
        </>
    );
}
