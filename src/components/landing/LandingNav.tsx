"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Stethoscope, X } from "lucide-react";

const navLinks = [
  { href: "#institutions", label: "Institutions" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Features" },
  { href: "#about", label: "About" },
  { href: "/opportunities", label: "Explore Opportunities" },
  { href: "#contact", label: "Contact" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background,box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-b border-[#E8EDF2] bg-[#F8FAFC]/90 shadow-[0_4px_24px_rgba(14,58,93,0.05)] backdrop-blur-xl"
          : "border-b border-transparent bg-[#F8FAFC]/80 backdrop-blur-md"
      }`}
    >
      <div className="landing-container flex h-16 items-center justify-between lg:h-[4.5rem]">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5"
          aria-label="MedJourney home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#1FA6A0] text-white shadow-[0_6px_16px_rgba(31,166,160,0.25)] transition-shadow duration-300 group-hover:shadow-[0_8px_20px_rgba(31,166,160,0.32)]">
            <Stethoscope className="h-[18px] w-[18px]" strokeWidth={2.25} />
          </span>
          <span className="font-display text-[1.25rem] leading-none tracking-tight text-[#0E3A5D]">
            Med<span className="text-[#1FA6A0]">Journey</span>
          </span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 lg:flex">
          {navLinks.map((link) =>
            link.href.startsWith("/") ? (
              <Link
                key={link.href}
                href={link.href}
                className="text-[0.875rem] font-medium text-[rgba(14,58,93,0.62)] transition-colors duration-200 hover:text-[#0E3A5D]"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="text-[0.875rem] font-medium text-[rgba(14,58,93,0.62)] transition-colors duration-200 hover:text-[#0E3A5D]"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
          <Link href="/sign-in" className="landing-btn landing-btn-ghost landing-btn-sm">
            Sign In
          </Link>
          <Link
            href="/onboarding/applying-for"
            className="landing-btn landing-btn-primary landing-btn-sm"
          >
            Create Account
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#E8EDF2] bg-white text-[#0E3A5D] transition-colors hover:bg-[#F8FAFC] lg:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[#E8EDF2] bg-[#F8FAFC] lg:hidden">
          <div className="landing-container flex flex-col gap-1 py-4">
            {navLinks.map((link) =>
              link.href.startsWith("/") ? (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-[14px] px-3.5 py-3 text-[0.9375rem] font-medium text-[rgba(14,58,93,0.72)] transition-colors hover:bg-white hover:text-[#0E3A5D]"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-[14px] px-3.5 py-3 text-[0.9375rem] font-medium text-[rgba(14,58,93,0.72)] transition-colors hover:bg-white hover:text-[#0E3A5D]"
                >
                  {link.label}
                </a>
              ),
            )}
            <div className="mt-3 grid gap-2 border-t border-[#E8EDF2] pt-4">
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="landing-btn landing-btn-secondary w-full"
              >
                Sign In
              </Link>
              <Link
                href="/onboarding/applying-for"
                onClick={() => setOpen(false)}
                className="landing-btn landing-btn-primary w-full"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
