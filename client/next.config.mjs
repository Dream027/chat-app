/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: () => {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/api/:path*",
      },
    ];
  },
  redirects: () => {
    return [
      {
        source: "/login",
        destination: "/signin",
        permanent: true,
      },
      {
        source: "/register",
        destination: "/signin",
        permanent: true,
      },
    ];
  }
};

export default nextConfig;
