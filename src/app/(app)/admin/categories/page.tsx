import prisma from '~/lib/prisma';

const getData = async () => {
    const categories = await prisma.category.findMany();

    return { categories };
};

export default async function CategoriesAdmin() {
    const { categories } = await getData();

    return <div />;
}
