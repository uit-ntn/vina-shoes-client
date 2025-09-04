import type { NextConfig } from "next";

const sanitizeEnv = (value: string | undefined, fallback: string): string => {
  return (value || fallback).trim().replace(/\/+$/, ""); // trim + bỏ "/" cuối
};

// Chỉ dùng 1 biến duy nhất cho backend API
const backendUrl = sanitizeEnv(
  process.env.NEXT_PUBLIC_API_URL,
  "https://api.vinashoes.org"
);

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["react-icons"],
    serverActions: {
      allowedOrigins: ["localhost:3000", "api.vinashoes.org", "img.vinashoes.org"],
    },
  },

  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    domains: [
      "d12znbzrksh6ne.cloudfront.net",
      "img.vinashoes.org",
      "via.placeholder.com",
    ],
    remotePatterns: [
      { protocol: "https", hostname: "d12znbzrksh6ne.cloudfront.net", pathname: "/**" },
      { protocol: "https", hostname: "img.vinashoes.org", pathname: "/**" },
      { protocol: "https", hostname: "via.placeholder.com", pathname: "/**" },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  async rewrites() {
    return [
      { source: "/api/products/:path*", destination: `${backendUrl}/api/products/:path*` },
      { source: "/api/orders/:path*", destination: `${backendUrl}/api/orders/:path*` },
      { source: "/api/users/:path*", destination: `${backendUrl}/api/users/:path*` },
      { source: "/api/auth/:path*", destination: `${backendUrl}/api/auth/:path*` },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },

  webpack: (config, { dev, isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": require("path").resolve(__dirname, "src"),
      };
    }

    return config;
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  output: "standalone",

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },

  logging: {
    fetches: { fullUrl: true },
  },

  poweredByHeader: false,
  compress: true,

  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    NEXT_PUBLIC_API_URL: backendUrl, // đưa lại biến sạch cho client
  },

  trailingSlash: false,
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
