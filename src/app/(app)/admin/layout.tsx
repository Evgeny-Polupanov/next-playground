import { getSession } from '@/shared';
import { Tabs } from '@/widgets';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { FC, ReactNode } from 'react';
import prisma from '~/lib/prisma';

export const metadata: Metadata = {
    title: 'Admin Dashboard',
};

const getData = async () => {
    const session = await getSession();

    const user = await prisma.user.findFirst({
        where: { id: session?.user.id },
    });

    if (!user?.isAdmin) {
        redirect('/');
    }
};

const tabs = [
    {
        url: '/admin',
        label: 'Users',
    },
    {
        url: '/admin/categories',
        label: 'Product Categories',
    },
    {
        url: '/admin/products',
        label: 'Products',
    },
];

const AdminLayout: FC<{ children: ReactNode }> = async ({ children }) => {
    await getData();

    return (
        <section className="p-4">
            <h1 className="text-5xl mb-4">Admin Dashboard</h1>
            <Tabs tabs={tabs} />
            {children}
        </section>
    );
};

export default AdminLayout;
