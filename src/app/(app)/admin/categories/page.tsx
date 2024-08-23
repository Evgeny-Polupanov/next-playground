import { AdminTable, TableEditButton } from '@/widgets';
import prisma from '~/lib/prisma';

const getData = async () => {
    const categories = await prisma.category.findMany({
        orderBy: { id: 'desc' },
    });

    return { categories };
};

const headers = ['ID', 'Title', 'Image URL', ''];

export default async function CategoriesAdmin() {
    const { categories } = await getData();

    return (
        <AdminTable
            headers={headers}
            length={categories.length}
            placeholder="No Categories"
        >
            {categories.map((c) => (
                <tr
                    key={c.id}
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                    <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                        {c.id}
                    </th>
                    <td className="px-6 py-4">{c.title}</td>
                    <td className="px-6 py-4">{c.imageUrl}</td>
                    <TableEditButton name="Category">
                        {/* <UserAdminForm user={c} /> */}
                    </TableEditButton>
                </tr>
            ))}
        </AdminTable>
    );
}
