import { SafeUser } from '@/entities';
import { AdminTable, TableEditButton, UserAdminForm } from '@/widgets';
import prisma from '~/lib/prisma';

const getData = async () => {
    const users: SafeUser[] = (await prisma.user.findMany()).map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        avatarUrl: u.avatarUrl,
        bio: u.bio,
        balance: u.balance,
        isAdmin: u.isAdmin,
    }));

    return { users };
};

const headers = [
    'ID',
    'First name',
    'Last name',
    'Email',
    'Avatar URL',
    'Bio',
    'Balance',
    'Is Admin',
    '',
];

export default async function Admin() {
    const { users } = await getData();

    return (
        <AdminTable headers={headers}>
            {users.map((u) => (
                <tr
                    key={u.id}
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                    <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                        {u.id}
                    </th>
                    <td className="px-6 py-4">{u.firstName}</td>
                    <td className="px-6 py-4">{u.lastName}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">{u.avatarUrl}</td>
                    <td className="px-6 py-4">{u.bio}</td>
                    <td className="px-6 py-4">{u.balance}</td>
                    <td className="px-6 py-4">{u.isAdmin ? 'Yes' : 'No'}</td>
                    <TableEditButton name="User">
                        <UserAdminForm user={u} />
                    </TableEditButton>
                </tr>
            ))}
        </AdminTable>
    );
}
