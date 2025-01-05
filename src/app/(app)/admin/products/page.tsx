import { AdminTable, TableEditButton } from '@/widgets';
import { ProductAdminForm } from '@/widgets/product-admin-form/ui';
import React from 'react';
import prisma from '~/lib/prisma';

const getData = async () => {
    const products = await prisma.product.findMany({
        orderBy: { id: 'desc' },
        include: { category: true },
    });

    return { products };
};

const headers = ['ID', 'Title', 'Category', 'Image URL', 'Price', 'Count', ''];

export default async function CategoriesAdmin() {
    const { products } = await getData();

    return (
        <>
            <div className="flex justify-end px-6 py-4">
                <TableEditButton name="Product" isNew>
                    <ProductAdminForm />
                </TableEditButton>
            </div>
            <AdminTable
                headers={headers}
                length={products.length}
                placeholder="No Products"
            >
                {products.map((p) => (
                    <tr
                        key={p.id}
                        className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                    >
                        <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            {p.id}
                        </th>
                        <td className="px-6 py-4">{p.title}</td>
                        <td className="px-6 py-4">
                            {p.category?.title ?? 'No category'}
                        </td>
                        <td className="px-6 py-4">{p.imageUrl}</td>
                        <td className="px-6 py-4">{p.price}</td>
                        <td className="px-6 py-4">{p.count}</td>
                        <td className="px-6 py-4">
                            <TableEditButton name="Product">
                                <ProductAdminForm product={p} />
                            </TableEditButton>
                        </td>
                    </tr>
                ))}
            </AdminTable>
        </>
    );
}
