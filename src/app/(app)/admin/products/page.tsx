import prisma from '~/lib/prisma';

const getData = async () => {
    const products = await prisma.product.findMany({ orderBy: { id: 'desc' } });

    return { products };
};

export default async function CategoriesAdmin() {
    const { products } = await getData();

    return <div />;
}
