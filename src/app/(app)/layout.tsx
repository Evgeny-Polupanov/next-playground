import { getSession } from '@/shared';
import { Footer, Header } from '@/widgets';
import { redirect } from 'next/navigation';
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

    const { avatarUrl } = user;

    const avatar = avatarUrl
        ? await s3Client.presignedGetObject('avatars', avatarUrl)
        : '';

    return { avatar };
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { avatar } = await getData();

    return (
        <>
            <Header avatar={avatar} />
            <main className="flex-grow">{children}</main>
            <Footer />
        </>
    );
}
