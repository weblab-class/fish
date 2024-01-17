/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/graphql",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "POST, GET, PUT, PATCH, DELETE, OPTIONS, HEAD",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
