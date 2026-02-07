import logo from "@/assets/logo.png";
import { Button, ContainerMax } from "@/components";
import Image from "next/image";
import Link from "next/link";
export const Header = () => {
  const navigationLinks = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Portfolio",
      href: "/portfolios",
    },
    {
      name: "Bookmarks",
      href: "/bookmarks",
    },
    {
      name: "Contact",
      href: "/contact",
    },
  ];
  return (
    <ContainerMax asChild>
      <header className="border-b-2 border-border">
        <div className="flex justify-between items-center py-3 ">
          <Link href={"/"} className="block">
            <Image
              src={logo}
              priority
              alt="logo"
              width={400}
              height={400}
              className="w-[150px]"
            />
          </Link>
          <nav className="flex items-center">
            <ul className="flex items-center">
              {navigationLinks?.map((link) => (
                <li key={link.name}>
                  <Button variant="ghost" asChild>
                    <Link href={link.href}>{link.name}</Link>
                  </Button>
                </li>
              ))}
              <li className="ml-1">
                <Button className="rounded-sm">Book a call</Button>
              </li>
            </ul>
            {/* <ThemeSwitcher /> */}
          </nav>
        </div>
      </header>
    </ContainerMax>
  );
};
