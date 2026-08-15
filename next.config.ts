/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Permanent redirects so old bookmarks/links to the previous route names
  // still resolve, and search engines transfer ranking to the new URLs
  // instead of indexing both.
  async redirects() {
    return [
      { source: "/login", destination: "/sign-in", permanent: true },
      { source: "/register", destination: "/sign-up", permanent: true },
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/terms-of-service",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
