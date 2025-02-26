/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: "/online-circle",
  async rewrites() {
    return [
      {
        source: "/online-circle/api/:path*",
        destination: "/api/:path*",
      },
      {
        source: "/online-circle/_next/:path*",
        destination: "/_next/:path*",
      },
      {
        source: "/online-circle/images/:query*",
        destination: '/_next/image/:query*'
      },
      // アプリケーションのその他のルートに対するリライトルール
      {
        source: "/online-circle/:path*",
        destination: "/:path*",
      },
    ];
  },
};

export default nextConfig;
