import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  return (
    <div className="container">
      <div className="flex justify-center min-h-screen items-center">
        <div>
          <h2 className="text-center text-2xl pt-5 font-bold">
            Welcome to my portfolio
          </h2>
          <div className="flex justify-center">
            <Link href="http://facebook.com/abirm09" className="block py-2">
              <Button>Click to visit facebook</Button>
            </Link>
          </div>

          <p className="text-center font-semibold">
            This site is under development.
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
