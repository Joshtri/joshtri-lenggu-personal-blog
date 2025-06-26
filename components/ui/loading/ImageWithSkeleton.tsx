// You can add this component within the same file or create a separate component

import Image from "next/image";
import { Skeleton } from "../skeleton";
import { useState } from "react";

function ImageWithSkeleton({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="h-full w-full rounded-t-md" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className={`
          object-cover group-hover:scale-105 transition-transform duration-300
          ${isLoading ? "opacity-0" : "opacity-100"}
        `}
        sizes="(max-width: 768px) 100vw, 33vw"
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setIsLoading(false)}
      />
    </>
  );
}

export default ImageWithSkeleton;
