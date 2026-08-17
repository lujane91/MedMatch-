import { AppShell } from "@/components/AppShell";
import { DownloadCvButton } from "@/components/DownloadCvButton";
import { ShareButton } from "@/components/ShareButton";
import { CircularProgress } from "@/components/profile/CircularProgress";
import { EmptyState } from "@/components/profile/EmptyState";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { StudentEvaluationsSection } from "@/components/profile/StudentEvaluationsSection";
import {
  Badge,
  Body,
  Caption,
  Card,
  CardTitle,
  Label,
} from "@/components/ui";
import {
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Check,
  FileText,
  GraduationCap,
  HeartHandshake,
  Languages,
  MapPin,
  ShieldCheck,
  Users,
} from "@/components/ui/icons";
import { profileData } from "@/data/profile";

export default function ProfilePage() {
  const profile = profileData;

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-8 mm-animate-fade-up lg:space-y-10">
        {/* Hero */}
        <section className="overflow-hidden rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface shadow-mm-sm">
          <div
            className="relative h-36 sm:h-44"
            style={{
              background:
                "linear-gradient(135deg, #0E3A5D 0%, #16486F 48%, #1FA6A0 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.18), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1), transparent 35%)",
              }}
            />
          </div>

          <div className="relative px-6 pb-8 sm:px-8 lg:px-10">
            <div className="-mt-16 flex flex-col gap-6 lg:-mt-20 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-[1.5rem] border-[5px] border-mm-white bg-mm-navy text-3xl font-semibold text-white shadow-mm-md sm:h-36 sm:w-36 sm:text-4xl">
                  {profile.initials}
                </div>
                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {profile.verifiedBadges.map((badge) => (
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
                    {profile.name}
                  </h1>
                  <p className="mt-2 text-[1rem] text-mm-text-secondary">
                    {profile.title} · {profile.year}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.875rem] text-mm-text-muted">
                    <span>{profile.specialty}</span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} strokeWidth={1.75} />
                      {profile.city}, {profile.country}
                    </span>
                  </div>
                  <p className="mt-3 text-[0.875rem] font-medium text-mm-navy">
                    Profile strength{" "}
                    <span className="text-mm-teal">{profile.strength.score}%</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 lg:pb-1">
                <a
                  href="#summary"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--mm-radius-lg)] bg-mm-teal px-4 text-[0.875rem] font-semibold text-white shadow-mm-teal transition-[transform,background] duration-[var(--mm-duration)] hover:-translate-y-px hover:bg-mm-teal-700"
                >
                  Edit Profile
                </a>
                <DownloadCvButton />
                <ShareButton label="Share Profile" />
              </div>
            </div>
          </div>
        </section>

        {/* Profile Strength */}
        <Card className="p-6 sm:p-8 lg:p-9">
          <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-12">
            <div className="flex justify-center lg:justify-start">
              <CircularProgress value={profile.strength.score} />
            </div>
            <div>
              <Label>Profile strength</Label>
              <h2 className="mt-2 font-[family-name:var(--mm-font-display)] text-[1.75rem] tracking-[-0.02em] text-mm-navy">
                Credibility that hospitals can trust
              </h2>
              <Body className="mt-3 max-w-xl">{profile.strength.summary}</Body>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-[0.8125rem] font-semibold text-mm-navy">
                    Completed
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {profile.strength.completed.map((item) => (
                      <li key={item.label} className="flex gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mm-teal text-white">
                          <Check size={11} strokeWidth={2.5} />
                        </span>
                        <span>
                          <span className="block text-[0.875rem] font-medium text-mm-navy">
                            {item.label}
                          </span>
                          <Caption>{item.detail}</Caption>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[0.8125rem] font-semibold text-mm-navy">
                    Missing
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {profile.strength.missing.map((item) => (
                      <li
                        key={item.label}
                        className="rounded-[var(--mm-radius-lg)] border border-mm-warning-50 bg-mm-warning-50/60 px-3.5 py-3"
                      >
                        <span className="block text-[0.875rem] font-medium text-mm-warning-700">
                          {item.label}
                        </span>
                        <Caption className="mt-0.5 text-mm-warning-700/70">
                          {item.detail}
                        </Caption>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-gray-50 p-5">
                <p className="text-[0.8125rem] font-semibold text-mm-navy">
                  Recommendations to improve
                </p>
                <ul className="mt-3 space-y-2">
                  {profile.strength.recommendations.map((tip) => (
                    <li
                      key={tip}
                      className="flex gap-2 text-[0.875rem] leading-relaxed text-mm-text-secondary"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mm-teal" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Professional Summary */}
        <ProfileSection
          id="summary"
          title="Professional Summary"
          description="Your narrative, goals, and preferences"
        >
          <div className="space-y-8">
            <div>
              <CardTitle as="h3">Bio</CardTitle>
              <Body className="mt-3 max-w-3xl">{profile.summary.bio}</Body>
            </div>
            <div>
              <CardTitle as="h3">Career goals</CardTitle>
              <Body className="mt-3 max-w-3xl">
                {profile.summary.careerGoals}
              </Body>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <CardTitle as="h3">Preferred specialties</CardTitle>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.summary.preferredSpecialties.map((item) => (
                    <Badge key={item} tone="teal">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <CardTitle as="h3">Preferred cities</CardTitle>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.summary.preferredCities.map((item) => (
                    <Badge key={item} tone="navy">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ProfileSection>

        {/* Education */}
        <ProfileSection id="education" title="Education" addLabel="Add education">
          <ul className="space-y-4">
            {profile.education.map((item) => (
              <li
                key={item.id}
                className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-gray-50 p-5"
              >
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-white text-mm-teal shadow-mm-xs">
                    <GraduationCap size={18} strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.9375rem] font-semibold text-mm-navy">
                      {item.degree}
                    </p>
                    <p className="mt-1 text-[0.875rem] text-mm-text-secondary">
                      {item.university}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.8125rem] text-mm-text-muted">
                      <span>Graduation {item.year}</span>
                      <span>GPA {item.gpa}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ProfileSection>

        {/* Clinical Experience */}
        <ProfileSection
          id="clinical"
          title="Clinical Experience"
          addLabel="Add experience"
        >
          <ul className="space-y-5">
            {profile.clinicalExperience.map((item) => (
              <li
                key={item.id}
                className="rounded-[var(--mm-radius-xl)] border border-mm-border p-5 sm:p-6"
              >
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-teal-50 text-mm-teal">
                    <Briefcase size={18} strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.9375rem] font-semibold text-mm-navy">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[0.875rem] text-mm-text-secondary">
                      {item.hospital}
                    </p>
                    <Caption className="mt-1">{item.duration}</Caption>
                    <ul className="mt-4 space-y-2">
                      {item.responsibilities.map((line) => (
                        <li
                          key={line}
                          className="flex gap-2 text-[0.875rem] leading-relaxed text-mm-text-secondary"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mm-teal" />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ProfileSection>

        {/* Research */}
        <ProfileSection id="research" title="Research" addLabel="Add project">
          <ul className="space-y-4">
            {profile.research.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-3 rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-gray-50 p-5 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <p className="text-[0.9375rem] font-semibold text-mm-navy">
                    {item.title}
                  </p>
                  <Caption className="mt-1">
                    {item.role} · {item.year}
                  </Caption>
                </div>
                <Badge tone={item.status === "Active" ? "teal" : "neutral"}>
                  {item.status}
                </Badge>
              </li>
            ))}
          </ul>
        </ProfileSection>

        {/* Publications */}
        <ProfileSection
          id="publications"
          title="Publications"
          addLabel="Add publication"
        >
          <ul className="space-y-4">
            {profile.publications.map((item) => (
              <li
                key={item.id}
                className="rounded-[var(--mm-radius-xl)] border border-mm-border p-5"
              >
                <div className="flex gap-3">
                  <BookOpen
                    size={18}
                    strokeWidth={1.75}
                    className="mt-0.5 shrink-0 text-mm-teal"
                  />
                  <div>
                    <p className="text-[0.9375rem] font-semibold text-mm-navy">
                      {item.title}
                    </p>
                    <Caption className="mt-1">
                      {item.venue} · {item.type} · {item.year}
                    </Caption>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ProfileSection>

        {/* Courses */}
        <ProfileSection
          id="courses"
          title="Courses & Certifications"
          addLabel="Add course"
        >
          <ul className="grid gap-4 sm:grid-cols-2">
            {profile.courses.map((item) => (
              <li
                key={item.id}
                className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-gray-50 p-5"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-white text-mm-teal shadow-mm-xs">
                  <Award size={18} strokeWidth={1.75} />
                </div>
                <p className="text-[0.875rem] font-semibold text-mm-navy">
                  {item.title}
                </p>
                <Caption className="mt-1">
                  {item.provider} · {item.year}
                </Caption>
                <Badge tone="navy" className="mt-3">
                  {item.type}
                </Badge>
              </li>
            ))}
          </ul>
        </ProfileSection>

        {/* Volunteer */}
        <ProfileSection
          id="volunteer"
          title="Volunteer Experience"
          addLabel="Add volunteer work"
        >
          {profile.volunteer.length === 0 ? (
            <EmptyState
              title="No volunteer experience yet"
              description="Highlight community clinics, health campaigns, or outreach work that shows commitment beyond the ward."
              actionLabel="Add volunteer experience"
              icon={<HeartHandshake size={18} strokeWidth={1.75} />}
            />
          ) : null}
        </ProfileSection>

        {/* Leadership */}
        <ProfileSection
          id="leadership"
          title="Leadership Experience"
          addLabel="Add leadership"
        >
          <ul className="space-y-4">
            {profile.leadership.map((item) => (
              <li
                key={item.id}
                className="rounded-[var(--mm-radius-xl)] border border-mm-border p-5 sm:p-6"
              >
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-navy text-white">
                    <Users size={18} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-[0.9375rem] font-semibold text-mm-navy">
                      {item.title}
                    </p>
                    <Caption className="mt-1">
                      {item.organization} · {item.duration}
                    </Caption>
                    <Body className="mt-3 text-[0.875rem]">
                      {item.description}
                    </Body>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ProfileSection>

        {/* Skills */}
        <ProfileSection id="skills" title="Skills" addLabel="Add skill">
          <div className="grid gap-8">
            {(
              [
                ["Medical skills", profile.skills.medical],
                ["Technical skills", profile.skills.technical],
                ["Soft skills", profile.skills.soft],
              ] as const
            ).map(([label, items]) => (
              <div key={label}>
                <CardTitle as="h3">{label}</CardTitle>
                <div className="mt-3 flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <Badge key={skill} tone="teal">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ProfileSection>

        {/* Languages */}
        <ProfileSection id="languages" title="Languages" addLabel="Add language">
          <ul className="grid gap-3 sm:grid-cols-3">
            {profile.languages.map((lang) => (
              <li
                key={lang.id}
                className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-gray-50 p-5"
              >
                <div className="mb-3 text-mm-teal">
                  <Languages size={18} strokeWidth={1.75} />
                </div>
                <p className="text-[0.875rem] font-semibold text-mm-navy">
                  {lang.name}
                </p>
                <Caption className="mt-1">{lang.level}</Caption>
              </li>
            ))}
          </ul>
        </ProfileSection>

        {/* Documents */}
        <ProfileSection id="documents" title="Documents" addLabel="Upload">
          <ul className="space-y-3">
            {profile.documents.map((doc) => (
              <li
                key={doc.id}
                className="flex flex-col gap-3 rounded-[var(--mm-radius-xl)] border border-mm-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-gray-50 text-mm-navy">
                    <FileText size={18} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-[0.875rem] font-semibold text-mm-navy">
                      {doc.name}
                    </p>
                    <Caption className="mt-0.5">Updated {doc.updated}</Caption>
                  </div>
                </div>
                <Badge tone={doc.status === "Uploaded" ? "success" : "warning"}>
                  {doc.status}
                </Badge>
              </li>
            ))}
          </ul>
        </ProfileSection>

        <StudentEvaluationsSection />

        {/* Eligibility */}
        <ProfileSection
          id="eligibility"
          title="Eligibility"
          description="Licensure and life-support credentials"
          addLabel="Add credential"
        >
          <ul className="grid gap-4 sm:grid-cols-2">
            {profile.eligibility.map((item) => (
              <li
                key={item.id}
                className="rounded-[var(--mm-radius-xl)] border border-mm-border p-5"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-teal-50 text-mm-teal">
                    <ShieldCheck size={18} strokeWidth={1.75} />
                  </div>
                  <Badge
                    tone={
                      item.status === "Verified" || item.status === "Valid"
                        ? "success"
                        : "warning"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
                <p className="text-[0.875rem] font-semibold text-mm-navy">
                  {item.name}
                </p>
                <Caption className="mt-1">{item.detail}</Caption>
              </li>
            ))}
          </ul>
        </ProfileSection>
      </div>
    </AppShell>
  );
}
