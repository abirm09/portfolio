import BannerImage from "./_components/heroArea/bannerHeft/BannerImage";
import WelcomeMessage from "./_components/heroArea/bannerRight/WelcomeMessage";

const page = () => {
  return (
    <section>
      <div className="container">
        <div className="grid grid-cols-2 gap-10 py-20">
          <div className="w-full flex justify-end">
            <BannerImage />
          </div>
          <div className="flex items-center">
            <div className="space-y-4">
              <WelcomeMessage />
              <div>
                <h2 className="font-inter text-3xl md:text-5xl font-black">
                  I&apos;m Abir Mahmud
                </h2>
                <p>Full-stack Developer</p>
              </div>
              <p>
                Experience in developing, deploying, and managing scalable
                applications with over three years of development expertise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
