/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:4000/api/:path*",
            },
            // {
            //     source: "/api/:path*",
            //     destination: "https://sharp-loyal-opossum.ngrok-free.app/api/:path*"
            // }
        ];
    },
    images: {
        remotePatterns: [
            {
                hostname: "localhost",
            },
            {
                hostname: "lh3.googleusercontent.com"
            },
            {
                hostname: "7183-38-183-43-56.ngrok-free.app"
            }
        ]
    }
};

export default nextConfig;
