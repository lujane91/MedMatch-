import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  ClipboardList,
  LineChart,
  Search,
  Sparkles,
  UserRound,
} from "lucide-react";
import { InstitutionLogo } from "@/components/landing/InstitutionLogo";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { SectionHeader } from "@/components/landing/SectionHeader";
import { StudentDashboardPreview } from "@/components/landing/StudentDashboardPreview";
import "@/components/landing/landing.css";

const institutions = [
  {
    name: "Saudi Commission for Health Specialties (SCFHS)",
    subtitle: "Health Specialties",
    logo: "/institutions/scfhs.svg",
  },
  {
    name: "King Faisal Specialist Hospital & Research Centre",
    subtitle: "Research & Education",
    logo: "/institutions/kfshrc.svg",
  },
  {
    name: "Ministry of National Guard Health Affairs",
    subtitle: "Medical Services",
    logo: "/institutions/mngha.png",
  },
  {
    name: "King Fahad Medical City",
    subtitle: "Medical City",
    logo: "/institutions/kfmc.png",
  },
  {
    name: "King Saud University Medical City",
    subtitle: "Academic Health",
    logo: "/institutions/ksumc.png",
  },
  {
    name: "Johns Hopkins Aramco Healthcare",
    subtitle: "Healthcare",
    logo: "/institutions/jhah.svg",
  },
  {
    name: "Imam Abdulrahman Bin Faisal University",
    subtitle: "University",
    logo: "/institutions/iau.svg",
  },
  {
    name: "King Fahad Specialist Hospital Dammam",
    subtitle: "Specialist Hospital",
    logo: "/institutions/kfsh-dammam.svg",
  },
  {
    name: "Security Forces Hospital",
    subtitle: "Healthcare",
    logo: null,
  },
  {
    name: "Dr. Sulaiman Al Habib Medical Group",
    subtitle: "Medical Group",
    logo: "/institutions/hmg.svg",
  },
  {
    name: "Mouwasat Medical Services",
    subtitle: "Medical Services",
    logo: "/institutions/mouwasat.png",
  },
  {
    name: "Fakeeh Care Group",
    subtitle: "Care Group",
    logo: "/institutions/fakeeh.svg",
  },
];

const steps = [
  {
    title: "Discover",
    description:
      "Search electives, observerships, and clinical attachments matched to your specialty.",
    icon: Search,
  },
  {
    title: "Apply",
    description:
      "Submit with one reusable profile and apply to multiple institutions with clarity.",
    icon: ClipboardList,
  },
  {
    title: "Track",
    description:
      "Follow interviews, timelines, and offers in a single workspace.",
    icon: LineChart,
  },
];

const features = [
  {
    id: "smart-matching",
    title: "Smart Matching",
    description:
      "Find opportunities based on specialty, training level, city, and career goals.",
    icon: Sparkles,
  },
  {
    id: "one-profile",
    title: "One Profile",
    description:
      "Create one professional profile and use it across multiple applications.",
    icon: UserRound,
  },
  {
    id: "application-tracking",
    title: "Application Tracking",
    description:
      "Track submitted applications, updates, interviews, and offers in one place.",
    icon: ClipboardList,
  },
  {
    id: "saved-opportunities",
    title: "Saved Opportunities",
    description:
      "Save programs and return to them when you are ready to apply.",
    icon: Bookmark,
  },
];

export default function HomePage() {
  return (
    <div className="landing-page min-h-screen">
      <LandingNav />

      {/* Hero */}
      <section className="landing-hero relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 65% 45% at 12% 8%, rgba(31,166,160,0.11), transparent 55%), radial-gradient(ellipse 55% 40% at 92% 18%, rgba(14,58,93,0.07), transparent 50%)",
          }}
        />

        <div className="landing-container relative landing-hero-inner">
          <div className="landing-hero-main">
            <div className="landing-fade-up landing-hero-copy">
              <h1 className="landing-h1">
                Healthcare <span className="landing-h1-accent">Training</span>,
                <br />
                Simplified.
              </h1>
              <p className="landing-lead landing-hero-lead">
                MedJourney helps healthcare students and graduates discover
                verified clinical training opportunities, submit applications with
                confidence, and manage every step of their training journey, from
                application to placement.
              </p>
            </div>
            <div className="landing-fade-up landing-delay-1 landing-hero-ctas">
              <Link href="/create-account" className="landing-btn landing-btn-primary">
                Create Account
                <ArrowRight size={16} strokeWidth={2.25} />
              </Link>
              <Link href="/sign-in" className="landing-btn landing-btn-secondary">
                Sign In
                <ArrowRight size={16} strokeWidth={2.25} />
              </Link>
            </div>
            <p className="landing-fade-up landing-delay-2 mt-5">
              <Link
                href="/hospital/sign-in"
                className="text-[0.875rem] font-medium text-[rgba(14,58,93,0.55)] transition-colors hover:text-[#1FA6A0]"
              >
                Hospital administrators →
              </Link>
            </p>
          </div>

          <div
            className="landing-hero-preview landing-fade-up landing-delay-2"
            aria-hidden="true"
          >
            <StudentDashboardPreview />
          </div>
        </div>
      </section>

      {/* Institutions */}
      <section id="institutions" className="bg-white">
        <div className="landing-container landing-section">
          <SectionHeader
            title="Institutions"
            subtitle="Trusted by Saudi Arabia's leading healthcare institutions."
            description="Discover training opportunities from hospitals and universities across the Kingdom."
          />

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {institutions.map((item) => (
              <div
                key={item.name}
                className="landing-card landing-card-interactive group flex min-h-[6.5rem] items-center gap-4 px-4 py-4 sm:min-h-[7rem] sm:gap-5 sm:px-5"
              >
                <InstitutionLogo src={item.logo} name={item.name} />
                <div className="min-w-0">
                  <p className="truncate text-[0.875rem] font-semibold leading-snug text-[#0E3A5D] sm:whitespace-normal sm:text-[0.9375rem]">
                    {item.name}
                  </p>
                  <p className="landing-caption mt-1">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="landing-section">
        <div className="landing-container">
          <SectionHeader
            title="How It Works"
            subtitle="Three simple steps from discovery to offer."
            description="Create your profile, discover opportunities, and apply with confidence."
          />

          <div className="mt-8 grid gap-3 sm:mt-9 lg:grid-cols-3 lg:gap-3.5">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="landing-card landing-card-interactive relative flex flex-col overflow-hidden px-5 py-4 sm:px-5 sm:py-[1.125rem]"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E8EDF2] bg-[#F8FAFC] text-[#1FA6A0]">
                      <Icon size={16} strokeWidth={1.75} />
                    </div>
                    <span className="font-display text-[1.5rem] leading-none text-[rgba(14,58,93,0.05)]">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="landing-h3-sans text-[1.0625rem]">{step.title}</h3>
                  <p className="landing-body mt-1.5 text-[0.875rem] leading-snug sm:leading-[1.45]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white">
        <div className="landing-container landing-section">
          <SectionHeader
            title="Features"
            subtitle="Built for modern healthcare careers."
            description="Every surface is designed to reduce friction for physicians and institutions."
          />

          <div className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="landing-card landing-card-interactive flex gap-4 p-5 sm:p-6"
                >
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[rgba(31,166,160,0.12)] text-[#1FA6A0]">
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="landing-h3-sans">{feature.title}</h3>
                    <p className="landing-body mt-2 text-[0.9375rem]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about">
        <div className="landing-container landing-section">
          <SectionHeader
            title="About"
            subtitle="A clearer path into clinical training."
            description="MedJourney was built for healthcare graduates who need more than a job board—structured matching, reusable profiles, and a single place to follow applications across Saudi institutions."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="pb-[var(--lp-section-y)] lg:pb-[var(--lp-section-y-lg)]">
        <div className="landing-container">
          <div className="relative overflow-hidden rounded-[18px] bg-[#0E3A5D] px-6 py-14 text-center sm:px-10 sm:py-16 lg:px-16 lg:py-[4.5rem]">
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden
              style={{
                background:
                  "radial-gradient(circle at 18% 20%, rgba(31,166,160,0.26), transparent 42%), radial-gradient(circle at 88% 78%, rgba(255,255,255,0.07), transparent 34%)",
              }}
            />
            <div className="relative mx-auto max-w-3xl">
              <SectionHeader
                title="Get Started"
                subtitle="Ready to start your healthcare journey?"
                description="Create your MedJourney profile, discover aligned training roles, and move through applications with clarity."
                onDark
              />
              <div className="mt-8 flex justify-center">
                <Link href="/create-account" className="landing-btn landing-btn-light">
                  Create Your Profile
                  <ArrowRight size={16} strokeWidth={2.25} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
