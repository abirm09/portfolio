import { Header } from "@/components";
import { ReactNode } from "react";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default PublicLayout;
