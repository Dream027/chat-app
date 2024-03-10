/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:4000/api/:path*",
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                hostname: "localhost",
            },
            {
                hostname: "lh3.googleusercontent.com"
            }
        ]
    }
};

export default nextConfig;
