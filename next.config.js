/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // mongoose! (see https://mongoosejs.com/docs/nextjs.html)
  experimental: {
    esmExternals: "loose", 
    serverComponentsExternalPackages: ["mongoose"]
  },
};

module.exports = nextConfig;
