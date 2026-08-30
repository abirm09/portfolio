import QueryProvider from "@/providers/QueryProvider";
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Abir Mahmud | Full Stack Web Developer",
  description:
    "Full Stack Web Developer with 3+ years of experience building scalable, modern web applications with the MERN stack, Next.js, and more.",
  keywords: [
    "Full Stack Developer",
    "Web Developer",
    "React Developer",
    "Next.js Developer",
    "MERN Stack",
    "Node.js",
    "MongoDB",
    "PostgreSQL",
  ],
  authors: [{ name: "Abir Mahmud" }],
  openGraph: {
    title: "Abir Mahmud | Full Stack Web Developer",
    description:
      "Full Stack Web Developer with 3+ years of experience building scalable, modern web applications.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abir Mahmud | Full Stack Web Developer",
    description:
      "Full Stack Web Developer with 3+ years of experience building scalable, modern web applications.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
