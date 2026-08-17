import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  FlaskConical,
  GraduationCap,
  LineChart,
  Search,
  Users,
} from "lucide-react";
import { InstitutionLogo } from "@/components/landing/InstitutionLogo";
import { JourneyStory } from "@/components/landing/JourneyStory";
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
      "Find training, research, conferences and career opportunities.",
    icon: Search,
  },
  {
    title: "Connect",
    description:
      "Apply, collaborate and connect with institutions and professionals.",
    icon: Users,
  },
  {
    title: "Grow",
    description:
      "Build your verified journey as your medical career progresses.",
    icon: LineChart,
  },
];

const features = [
  {
    id: "training",
    title: "Training",
    description:
      "Discover opportunities from medical school through fellowship.",
    icon: GraduationCap,
  },
  {
    id: "conferences",
    title: "Conferences",
    description: "Find medical conferences locally and internationally.",
    icon: CalendarDays,
  },
  {
    id: "research",
    title: "Research",
    description:
      "Discover research opportunities, share ideas and find collaborators.",
    icon: FlaskConical,
  },
  {
    id: "career-opportunities",
    title: "Career Opportunities",
    description: "Explore opportunities based on your stage and specialty.",
    icon: Briefcase,
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
                Your Medical <span className="landing-h1-accent">Journey</span>.
                <br />
                All in One Place.
              </h1>
              <p className="landing-lead landing-hero-lead">
                Training, research, conferences and career opportunities
                throughout your medical journey.
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

      <JourneyStory />

      {/* Institutions */}
      <section id="institutions" className="bg-white">
        <div className="landing-container landing-section">
          <SectionHeader
            title="Institutions"
            subtitle="Trusted by Saudi Arabia's leading healthcare institutions."
            description="Discover opportunities from hospitals and universities across the Kingdom."
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
            subtitle="One profile. Your whole medical journey."
            description="Discover opportunities, connect and grow throughout your journey."
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
            subtitle="Everything for your medical journey."
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
            subtitle="Built for every stage of your medical journey."
            description="MedJourney brings training, research, conferences and career opportunities together in one place."
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
                subtitle="Start your MedJourney"
                description="Build your profile and discover what comes next."
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
