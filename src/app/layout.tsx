import QueryProvider from "@/providers/QueryProvider";
import type { Metadata } from "next";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import { Inter, Permanent_Marker } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const permanentMarker = Permanent_Marker({
  variable: "--font-permanent-marker",
  subsets: ["latin"],
  weight: "400",
});

const siteUrl = "https://abirmahmud.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Abir Mahmud | Full-Stack Web Developer",
    template: "%s | Abir Mahmud",
  },

  description:
    "Abir Mahmud is a full-stack web developer building modern, scalable, and user-focused web applications using React, Next.js, Node.js, TypeScript, PostgreSQL, and MongoDB.",

  applicationName: "Abir Mahmud Portfolio",

  authors: [
    {
      name: "Abir Mahmud",
      url: siteUrl,
    },
  ],

  creator: "Abir Mahmud",
  publisher: "Abir Mahmud",

  keywords: [
    "Abir Mahmud",
    "Abir Mahmud Developer",
    "Abir Mahmud Portfolio",
    "Full Stack Developer",
    "Web Developer",
    "Frontend Developer",
    "Backend Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "TypeScript Developer",
    "JavaScript Developer",
    "MERN Stack Developer",
    "PostgreSQL Developer",
    "MongoDB Developer",
    "Bangladesh Web Developer",
    "Freelance Web Developer",
    "Remote Web Developer",
    "Full Stack Web Developer Bangladesh",
    "SAAS Developer",
    "Web Application Developer",
    "Software Engineer",
    "Software Developer",
    "Web Development Services",
    "Custom Web Development",
    "Responsive Web Design",
    "User Experience Design",
    "UI/UX Design",
    "Web Application Development",
    "E-commerce Development",
    "Content Management System (CMS) Development",
    "Progressive Web App (PWA) Development",
    "Single Page Application (SPA) Development",
    "API Development and Integration",
    "Database Design and Management",
    "Cloud Computing Services",
    "DevOps Services",
    "Continuous Integration and Deployment (CI/CD) Services",
  ],

  category: "technology",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Abir Mahmud",

    title: "Abir Mahmud | Full-Stack Web Developer",

    description:
      "I build modern, scalable, and user-focused web applications that solve real problems.",

    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Abir Mahmud - Full-Stack Web Developer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Abir Mahmud | Full-Stack Web Developer",

    description:
      "I build modern, scalable, and user-focused web applications that solve real problems.",

    images: ["/og.png"],

    creator: "@abirm09",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,

      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
    ],
  },

  verification: {
    google: "7uCtTaXnTKeycBIe2MVSTJPH3MMRhre9ACvpRt0JEdo",
  },

  other: {
    "theme-color": "#050505",
    "color-scheme": "dark",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="/api/env.js" strategy="beforeInteractive" />
      </head>
      <body
        className={`${inter.className} ${inter.variable} ${permanentMarker.variable} antialiased`}
      >
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
