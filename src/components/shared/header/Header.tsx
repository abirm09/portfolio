"use client";

import { Button, ContainerMax } from "@/components";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

const navigationLinks = [
  { name: "About", href: "/#about" },
  { name: "Skills", href: "/#skills" },
  { name: "Projects", href: "/#projects" },
  { name: "Blog", href: "/blog" },
  { name: "Experience", href: "/#experience" },
  { name: "Contact", href: "/#contact" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 16);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <ContainerMax asChild>
      <header
        className={`border-border sticky top-0 z-50 border-b backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-300 motion-reduce:transition-none ${
          scrolled
            ? "bg-background/98 shadow-[0_18px_40px_-20px_rgba(15,35,20,0.45)] dark:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.8)]"
            : "bg-background/95 shadow-[0_8px_24px_-18px_rgba(15,35,20,0.35)]"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-[padding] duration-300 motion-reduce:transition-none ${scrolled ? "py-2.5" : "py-4"}`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="text-foreground inline-flex items-center gap-2 text-lg font-black tracking-[-0.07em]"
          >
            <span className="bg-brand-accent text-brand-accent-foreground flex size-9 items-center justify-center rounded-lg text-sm tracking-[-0.08em]">
              AM
            </span>
            ABIR MAHMUD<span className="text-primary">.</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
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
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}

            <Button size="sm" className="ml-2 h-10 rounded-full px-5" asChild>
              <Link href="/#contact">Hire Me</Link>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            {mounted && (
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                {resolvedTheme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav id="mobile-navigation" className="border-border border-t pt-4 pb-4 md:hidden">
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
                className="mt-2 rounded-full"
                asChild
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href="/#contact">Hire Me</Link>
              </Button>
            </div>
          </nav>
        )}
      </header>
    </ContainerMax>
  );
};
