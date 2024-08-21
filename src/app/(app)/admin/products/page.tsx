import prisma from '~/lib/prisma';

const getData = async () => {
    const products = await prisma.product.findMany();

    return { products };
};

export default async function CategoriesAdmin() {
    const { products } = await getData();

    return <div />;
}
