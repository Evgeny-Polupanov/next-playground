/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol:
                    process.env.NODE_ENV === 'production' ? 'https' : 'http',
                hostname: process.env.MINIO_URL,
                port: '9000',
            },
        ],
    },
};

export default nextConfig;
