import { ContainerMax } from "@/components";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  { name: "GitHub", icon: "/github.png", url: "https://github.com/abirm09" },
  { name: "LinkedIn", icon: "/linkedin.png", url: "https://linkedin.com/in/abirm09" },
  { name: "Twitter", icon: "/twitter.png", url: "https://twitter.com/abirm09" },
  { name: "Whatsapp", icon: "/whatsapp.png", url: "https://wa.me/8801789699367" },
];

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50">
      <ContainerMax asChild>
        <div className="pt-10">
          {/* Main footer content */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">Abir Mahmud</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Full Stack Web Developer building modern, scalable web applications with the MERN
                stack and beyond.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Connect</h4>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all duration-300"
                    aria-label={social.name}
                  >
                    <Image
                      src={social.icon}
                      alt={social.name}
                      width={200}
                      height={200}
                      className="w-6 h-6"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border py-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-muted-foreground text-sm flex items-center gap-1">
                © {currentYear} Abir Mahmud. Made with{" "}
                <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in Bangladesh
              </p>
              <p className="text-muted-foreground text-sm">All rights reserved.</p>
            </div>
          </div>
        </div>
      </ContainerMax>
    </footer>
  );
};
