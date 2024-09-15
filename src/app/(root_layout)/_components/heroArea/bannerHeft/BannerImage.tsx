import Image from "next/image";

const BannerImage = () => {
  return (
    <Image
      src="/images/abirmahmud/squire-image.jpg"
      alt="MD Abir mahmud profile picture"
      height={400}
      width={400}
      className="rounded-full w-72 h-72"
    />
  );
};

export default BannerImage;
