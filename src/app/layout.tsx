import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { StructuredData } from "@/components/StructuredData";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://iatoba.com'),
  title: {
    default: "Iatoba - Full-Stack Developer & DevOps Engineer",
    template: "%s | Iatoba"
  },
  description: "Building high-performance web applications with Next.js, React, and 3D experiences. Specializing in full-stack development, workflow automation, self-hosted AI, and DevOps solutions.",
  keywords: ["Full-Stack Developer", "DevOps Engineer", "Next.js", "React", "Three.js", "3D Web Development", "Workflow Automation", "n8n", "Self-Hosted AI", "LLM", "Docker", "CI/CD", "Azure DevOps", "Nginx", "TypeScript", "Web Development", "API Development", "E2E Testing"],
  authors: [{ name: "Iatoba" }],
  creator: "Iatoba",
  publisher: "Iatoba",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://iatoba.com",
    title: "Iatoba - Full-Stack Developer & DevOps Engineer",
    description: "Building high-performance web applications with Next.js, React, and 3D experiences. Specializing in full-stack development, workflow automation, self-hosted AI, and DevOps solutions.",
    siteName: "Iatoba Portfolio",
    images: [
      {
        url: "/portfolio-3d-landing.png",
        width: 1200,
        height: 630,
        alt: "Iatoba - Full-Stack Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Iatoba - Full-Stack Developer & DevOps Engineer",
    description: "Building high-performance web applications with Next.js, React, and 3D experiences. Specializing in full-stack development, workflow automation, and DevOps.",
    images: ["/portfolio-3d-landing.png"],
    creator: "@iatoba",
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'Yqbr9UrIk40ur1TmS4473k_Sd2EfaPGWNELIdTvjMvc',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <meta property="fb:app_id" content="1299395948543288" />
        <StructuredData />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
