"use client";

import { Button, ContainerMax } from "@/components";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Permanent_Marker } from "next/font/google";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

const navigationLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

const permanentMarker = Permanent_Marker({
  variable: "--font-permanent-marker",
  subsets: ["latin"],
  weight: "400",
});

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ContainerMax asChild>
      <header
        className={`sticky z-50 border-border bg-background/70 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 ease-in-out ${scrolled ? "top-0 md:top-3 border rounded-none md:rounded-full shadow-lg shadow-primary/5 md:px-6" : "top-0 border-b"}`}
      >
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link
            href="/"
            className={`inline-block text-xl gradient-text ${permanentMarker.className}`}
          >
            ABIR MAHMUD
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationLinks.map((link) => (
              <Button key={link.name} variant="ghost" size="sm" asChild>
                <Link href={link.href}>{link.name}</Link>
              </Button>
            ))}

            {/* Theme toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="ml-2"
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            )}

            <Button size="sm" variant="gradient" className="ml-2" asChild>
              <Link href="#contact">Hire Me</Link>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            {mounted && (
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                {resolvedTheme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-1">
              {navigationLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="ghost"
                  className="justify-start"
                  asChild
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href={link.href}>{link.name}</Link>
                </Button>
              ))}
              <Button
                variant="gradient"
                className="mt-2"
                asChild
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href="#contact">Hire Me</Link>
              </Button>
            </div>
          </nav>
        )}
      </header>
    </ContainerMax>
  );
};
