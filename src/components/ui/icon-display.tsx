import React from "react";

interface IconImgProps {
  src: string;
  alt?: string;
  className?: string;
}

export function IconImg({ src, alt = "Icon", className = "" }: IconImgProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-6 h-6 object-contain ${className}`}
      onError={(e) => {
        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor'%3E%3Cpath d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'/%3E%3C/svg%3E";
      }}
    />
  );
}

interface IconSVGProps {
  svg: string;
  className?: string;
}

export function IconSVG({ svg, className = "" }: IconSVGProps) {
  return (
    <div
      className={`w-6 h-6 flex items-center justify-center ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
