import { ContainerMax } from "@/components";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const socialLinks = [
  { name: "GitHub", url: "https://github.com/abirm09" },
  { name: "LinkedIn", url: "https://linkedin.com/in/abirm09" },
  { name: "X / Twitter", url: "https://x.com/abirm09" },
  { name: "WhatsApp", url: "https://wa.me/8801789699367" },
];

const navLinks = [
  { name: "About", href: "/#about" },
  { name: "Skills", href: "/#skills" },
  { name: "Projects", href: "/#projects" },
  { name: "Experience", href: "/#experience" },
  { name: "Contact", href: "/#contact" },
];

export const Footer = () => (
  <footer className="bg-[#17291f] text-white">
    <ContainerMax>
      <div className="flex flex-col gap-7 border-b border-white/15 py-12 md:flex-row md:items-end md:justify-between md:py-16">
        <div>
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-[#c8ee73] uppercase">
            Have something in mind?
          </p>
          <h2 className="max-w-2xl text-4xl leading-[1.05] font-semibold tracking-[-0.055em] sm:text-5xl md:text-6xl">
            Let&apos;s build what comes next.
          </h2>
        </div>
        <Link
          href="/#contact"
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#c8ee73] px-6 text-sm font-semibold text-[#17291f] transition-colors hover:bg-[#dcfa9c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c8ee73] md:self-auto"
        >
          Start a conversation <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr] lg:gap-16">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-xl font-black tracking-[-0.06em]"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#c8ee73] text-sm text-[#17291f]">
              AM
            </span>
            ABIR MAHMUD<span className="text-[#c8ee73]">.</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
            Full Stack Developer building commerce platforms, SaaS products, and dependable web
            applications.
          </p>
          <p className="mt-5 text-xs font-medium tracking-[0.14em] text-[#c8ee73] uppercase">
            Based in Bangladesh · Working worldwide
          </p>
        </div>

        <div>
          <h3 className="mb-5 text-xs font-semibold tracking-[0.18em] text-white/45 uppercase">
            Explore
          </h3>
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-sm text-white/80 transition-colors hover:text-[#c8ee73] focus-visible:text-[#c8ee73]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-xs font-semibold tracking-[0.18em] text-white/45 uppercase">
            Elsewhere
          </h3>
          <ul className="space-y-3">
            {socialLinks.map((social) => (
              <li key={social.name}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-white/80 transition-colors hover:text-[#c8ee73] focus-visible:text-[#c8ee73]"
                >
                  {social.name}
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-white/15 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Abir Mahmud. All rights reserved.</p>
        <p>Built with care in Bangladesh.</p>
      </div>
    </ContainerMax>
  </footer>
);
