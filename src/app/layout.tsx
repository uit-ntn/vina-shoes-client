import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ProductProvider } from '@/context/ProductContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Vina Shoes - Premium Footwear Store",
    template: "%s | Vina Shoes"
  },
  description: "Discover premium quality shoes for every occasion. From casual sneakers to formal footwear, find your perfect pair at Vina Shoes.",
  keywords: ["shoes", "sneakers", "footwear", "nike", "adidas", "running shoes", "casual shoes"],
  authors: [{ name: "Vina Shoes" }],
  creator: "Vina Shoes",
  publisher: "Vina Shoes",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Vina Shoes - Premium Footwear Store',
    description: 'Discover premium quality shoes for every occasion.',
    siteName: 'Vina Shoes',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Vina Shoes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vina Shoes - Premium Footwear Store',
    description: 'Discover premium quality shoes for every occasion.',
    images: ['/og-image.jpg'],
    creator: '@vinashoes',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ProductProvider>
            {children}
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
