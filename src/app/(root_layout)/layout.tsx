import Header from "@/components/shared/header";
import { ReactNode } from "react";

const Homepage = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default Homepage;
