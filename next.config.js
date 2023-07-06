/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s1.ticketm.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ticketweb.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.ticketmaster.eu",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
