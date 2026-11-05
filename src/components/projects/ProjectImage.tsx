import { TProjectImage } from "@/data/projects";
import { cn } from "@/lib/utils";

type ProjectImageProps = {
  image: TProjectImage;
  className?: string;
  showCaption?: boolean;
};

export const ProjectImage = ({ image, className, showCaption = false }: ProjectImageProps) => {
  return (
    <div className={cn("group/image bg-secondary relative overflow-hidden", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={image.title}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 group-hover/image:scale-105"
      />

      {showCaption && (
        <div className="absolute inset-x-0 bottom-0 bg-black/75 p-3">
          <p className="text-xs font-medium text-white">{image.title}</p>
        </div>
      )}
    </div>
  );
};
