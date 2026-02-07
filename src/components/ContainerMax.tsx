import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { ReactNode } from "react";

type ContainerMaxProps = {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
};

export const ContainerMax = ({
  children,
  asChild = false,
  className = "",
}: ContainerMaxProps) => {
  const Comp = asChild ? Slot : "div";
  const baseClasses = "max-w-7xl mx-auto px-3 md:px-5";
  const combinedClasses = className ? cn(baseClasses, className) : baseClasses;

  return <Comp className={combinedClasses}>{children}</Comp>;
};
