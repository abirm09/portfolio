import Image from "next/image";
import Link from "next/link";
import ActiveLink from "../../activeLink/ActiveLink";

const NavBar = () => {
  const links = [
    {
      title: "Home",
      url: "/",
    },
    {
      title: "About",
      url: "/about",
    },
    {
      title: "Projects",
      url: "/projects",
    },
    {
      title: "Blogs",
      url: "/blogs",
    },
  ];
  return (
    <div className="container">
      <div className="flex justify-between items-center">
        <Link href="/" className="select-none">
          <Image
            src="/images/logo/logo-optimized.png"
            width={200}
            height={200}
            alt="Logo"
            className="w-[200px] h-[66.6666666666667px]"
          />
        </Link>
        <div>
          <ul className="flex gap-2">
            {links.map((link) => (
              <li key={link.title}>
                <ActiveLink
                  activeClassName="text-rose-500"
                  className="px-3 py-2 rounded-md font-semibold hover:text-rose-500 transition-all"
                  href={link.url}
                >
                  {link.title}
                </ActiveLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
