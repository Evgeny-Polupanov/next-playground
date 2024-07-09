import * as Minio from 'minio';

export const s3Client = new Minio.Client({
    endPoint: process.env.MINIO_URL,
    port: 9000,
    accessKey: 'ROOTUSER',
    secretKey: 'ROOTPASSWORD',
    useSSL: true,
});

export const createBucketIfNotExists = async (bucketName: string) => {
    const bucketExists = await s3Client.bucketExists(bucketName);
    if (!bucketExists) {
        await s3Client.makeBucket(bucketName);
    }
};
