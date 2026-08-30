"use client";

import { BadgeCheck, MapPin } from "@/components/ui/icons";
import { getPassportFacts } from "@/data/intern";
import { profileData } from "@/data/profile";
import { useInternStore } from "@/lib/intern-store";

export function ProfilePassport() {
  const { profile, hydrated } = useInternStore();
  const facts =
    hydrated && profile.onboardingComplete ? getPassportFacts(profile) : [];
  const name =
    hydrated && profile.onboardingComplete && profile.fullName.trim()
      ? profile.fullName.trim()
      : profileData.name;

  return (
    <div className="pb-1">
      <div className="flex flex-wrap items-center gap-2">
        {profileData.verifiedBadges.map((badge) => (
          <span
            key={badge.id}
            className="inline-flex items-center gap-1.5 rounded-full bg-mm-teal-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-mm-teal-700"
          >
            <BadgeCheck size={12} strokeWidth={2} />
            {badge.label}
          </span>
        ))}
      </div>
      <h1 className="mt-3 font-[family-name:var(--mm-font-display)] text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] tracking-[-0.025em] text-mm-navy">
        {name}
      </h1>
      {facts.length > 0 ? (
        <div className="mt-2 space-y-1">
          {facts.map((fact) => (
            <p key={fact} className="text-[1rem] text-mm-text-secondary">
              {fact}
            </p>
          ))}
        </div>
      ) : (
        <>
          <p className="mt-2 text-[1rem] text-mm-text-secondary">
            {profileData.title} · {profileData.year}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.875rem] text-mm-text-muted">
            <span>{profileData.specialty}</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} strokeWidth={1.75} />
              {profileData.city}, {profileData.country}
            </span>
          </div>
        </>
      )}
      <p className="mt-3 text-[0.875rem] font-medium text-mm-navy">
        Profile strength{" "}
        <span className="text-mm-teal">{profileData.strength.score}%</span>
      </p>
    </div>
  );
}
