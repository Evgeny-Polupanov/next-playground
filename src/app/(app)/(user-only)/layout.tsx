import { getSession } from '@/shared';
import { redirect } from 'next/navigation';
import prisma from '~/lib/prisma';

const getData = async () => {
    const session = await getSession();

    const user = await prisma.user.findFirst({
        where: { id: session?.user.id },
    });

    if (user?.isAdmin) {
        redirect('/admin');
    }
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    await getData();

    return children;
}
