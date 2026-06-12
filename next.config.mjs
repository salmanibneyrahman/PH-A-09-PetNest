// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "**",
//       },
//       {
//         protocol: "http",
//         hostname: "**",
//       },
//     ],
//   },
//   async rewrites() {
//     return [
//       {
//         source: "/proxy/:path*",
//         destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/:path*`,
//       },
//     ];
//   },
//   async headers() {
//     return [
//       {
//         source: "/api/:path*",
//         headers: [
//           { key: "Access-Control-Allow-Credentials", value: "true" },
//           {
//             key: "Access-Control-Allow-Origin",
//             value: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
//           },
//           {
//             key: "Access-Control-Allow-Methods",
//             value: "GET,DELETE,PATCH,POST,PUT,OPTIONS",
//           },
//           {
//             key: "Access-Control-Allow-Headers",
//             value:
//               "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
//           },
//         ],
//       },
//     ];
//   },
//   experimental: {
//     serverComponentsExternalPackages: ['@better-auth/kysely-adapter'],
//   },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/proxy/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ];
  },
  serverExternalPackages: ["@better-auth/kysely-adapter", "kysely"],
};

export default nextConfig;

