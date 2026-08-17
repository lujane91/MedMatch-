"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";

type InstitutionLogoProps = {
  src: string | null;
  name: string;
};

/**
 * Equal-sized logo container with object-contain (no stretch/crop)
 * and a building icon fallback when the asset is missing or fails to load.
 * Mobile 64×64 · Desktop 80×80 for stronger logo presence.
 */
export function InstitutionLogo({ src, name }: InstitutionLogoProps) {
  const [failed, setFailed] = useState(!src);

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-[#F8FAFC] ring-1 ring-[#E8EDF2] sm:h-20 sm:w-20 lg:h-[5.25rem] lg:w-[5.25rem]">
      {!failed && src ? (
        // Native img required for onError fallback with local SVG/PNG assets
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          width={84}
          height={84}
          className="h-full w-full object-contain p-1 sm:p-1.5"
          onError={() => setFailed(true)}
        />
      ) : (
        <Building2
          className="h-7 w-7 text-[#0E3A5D]/65 sm:h-8 sm:w-8"
          strokeWidth={1.75}
          aria-hidden
        />
      )}
      <span className="sr-only">{name} logo</span>
    </div>
  );
}
