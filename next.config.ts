import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features
  experimental: {
    optimizePackageImports: ['react-icons'],
    serverActions: {
      allowedOrigins: ['localhost:3000', 'api.vinashoes.org'],
    },
  },

  // Image optimization (S3 qua CloudFront)
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
    domains: [
      'd12znbzrksh6ne.cloudfront.net', // CloudFront cho S3
      'img.vinashoes.org',             // custom domain (nếu bạn gắn)
      'via.placeholder.com',           // For placeholder images
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd12znbzrksh6ne.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.vinashoes.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // URL rewrites: proxy API -> backend
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'https://api.vinashoes.org';
    return [
      {
        source: '/api/products/:path*',
        destination: `${backendUrl}/api/products/:path*`,
      },
      {
        source: '/api/orders/:path*',
        destination: `${backendUrl}/api/orders/:path*`,
      },
      {
        source: '/api/users/:path*',
        destination: `${backendUrl}/api/users/:path*`,
      },
      {
        source: '/api/auth/:path*',
        destination: `${backendUrl}/api/auth/:path*`,
      },
    ];
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },

  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': require('path').resolve(__dirname, 'src'),
      };
    }

    return config;
  },

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Output configuration
  output: 'standalone',

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Logging
  logging: {
    fetches: { fullUrl: true },
  },

  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Environment variables available on client
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    BACKEND_URL: process.env.BACKEND_URL || 'https://api.vinashoes.org',
  },

  // Standalone output for Docker deployment
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
