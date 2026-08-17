"use client";

import { DemoActionTrigger } from "@/components/demo/DemoActionTrigger";

export function CompleteProfileButton({
  className,
  children = "Complete Profile",
}: {
  className?: string;
  children?: string;
}) {
  return (
    <DemoActionTrigger
      kind="completeProfile"
      label={children}
      doneLabel="Profile complete"
      className={className}
    />
  );
}
