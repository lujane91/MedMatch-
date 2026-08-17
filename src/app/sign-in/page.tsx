"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Input } from "@/components/ui";
import { useInternStore } from "@/lib/intern-store";
import { useSubscriptionStore } from "@/lib/subscription-store";

export default function SignInPage() {
  const router = useRouter();
  const { profile, setAccountBasics, hydrated } = useInternStore();
  const {
    hydrated: subscriptionHydrated,
    canAccessDashboard,
    subscription,
  } = useSubscriptionStore();
  const [email, setEmail] = useState("amina.hassan@medmatch.edu");
  const [password, setPassword] = useState("password123");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.fullName) {
      setAccountBasics({
        fullName: "Amina Hassan",
        email,
        mobile: "+966 50 000 0000",
        password,
      });
    }

    const onboardingDone =
      profile.onboardingComplete && profile.field === "medicine";

    if (!onboardingDone) {
      router.push("/onboarding/applying-for");
      return;
    }

    if (canAccessDashboard) {
      router.push("/dashboard");
      return;
    }

    if (subscription.paymentStatus === "Failed") {
      router.push("/subscription/failed");
      return;
    }

    router.push("/subscription/complete");
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle="Continue to choose your pathway and open your intern workspace."
      panelTitle="Continue your training journey"
      panelBody="Sign in to plan internship rotations, manage applications, and keep opportunities organized."
      footer={
        <>
          New to MedJourney?{" "}
          <Link
            href="/create-account"
            className="font-semibold text-mm-teal transition-colors hover:text-mm-teal-700"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={!hydrated || !subscriptionHydrated}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-[1.125rem] text-[0.875rem] font-semibold text-white shadow-mm-teal transition-[transform,background] duration-[var(--mm-duration)] hover:-translate-y-px hover:bg-mm-teal-700 disabled:opacity-60"
        >
          Sign in
        </button>
      </form>
    </AuthShell>
  );
}
