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
        permanent: false,
      },
      {
        source: "/register",
        destination: "/signin",
        permanent: false,
      },
    ];
  }
};

export default nextConfig;
