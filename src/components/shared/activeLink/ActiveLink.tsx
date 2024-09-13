"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const ActiveLink = ({
  href,
  children,
  className,
  activeClassName,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
}) => {
  const pathName = usePathname();
  const isActive = pathName === href ? true : false;
  return (
    <Link
      className={`${cn("select-none", className)} ${isActive ? cn(activeClassName) : ""}`}
      href={href}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;
