import Image from "next/image";

interface FramedImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

export default function FramedImage({ src, alt, sizes, priority = false, className = "" }: Readonly<FramedImageProps>) {
  return (
    <div className={`absolute inset-0 overflow-hidden bg-night ${className}`}>
      <Image src={src} alt="" aria-hidden fill sizes="128px" className="scale-110 object-cover opacity-45 blur-2xl" />
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-contain" />
    </div>
  );
}
