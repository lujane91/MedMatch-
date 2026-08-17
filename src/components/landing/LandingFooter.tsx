import Link from "next/link";
import { ArrowUpRight, Globe, Mail, Share2 } from "lucide-react";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About MedJourney", href: "#about" },
      { label: "Institutions", href: "#institutions" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Features",
    links: [
      { label: "Training", href: "#features" },
      { label: "Conferences", href: "#features" },
      { label: "Research", href: "#features" },
      { label: "Career Opportunities", href: "#features" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#legal-privacy" },
      { label: "Terms", href: "#legal-terms" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "#contact" },
      { label: "FAQ", href: "#how-it-works" },
      { label: "Contact Support", href: "#contact" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer id="contact" className="bg-white">
      <div className="landing-container py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] lg:gap-16">
          <div>
            <Link
              href="/"
              className="font-display text-[1.375rem] tracking-tight text-[#0E3A5D]"
            >
              Med<span className="text-[#1FA6A0]">Journey</span>
            </Link>
            <p className="landing-body mt-4 max-w-[17rem] text-[0.9375rem]">
              Training, research, conferences and career opportunities in one
              place.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {[
                { icon: Share2, label: "Share MedJourney" },
                { icon: Globe, label: "Visit website" },
                { icon: Mail, label: "Email MedJourney" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href={label.includes("Email") ? "mailto:hello@medmatch.sa" : "#contact"}
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#E8EDF2] text-[rgba(14,58,93,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(31,166,160,0.35)] hover:text-[#1FA6A0]"
                >
                  <Icon size={16} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[rgba(14,58,93,0.4)]">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[0.875rem] text-[rgba(14,58,93,0.62)] transition-colors duration-200 hover:text-[#0E3A5D]"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[#E8EDF2] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="landing-caption">
            © {new Date().getFullYear()} MedJourney. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              id="legal-privacy"
              href="#contact"
              className="landing-caption transition-colors hover:text-[#0E3A5D]"
            >
              Privacy
            </a>
            <a
              id="legal-terms"
              href="#contact"
              className="landing-caption transition-colors hover:text-[#0E3A5D]"
            >
              Terms
            </a>
            <a
              href="mailto:hello@medmatch.sa"
              className="inline-flex items-center gap-1 text-[0.8125rem] font-medium text-[#1FA6A0] transition-colors hover:text-[#178f8a]"
            >
              hello@medmatch.sa
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
