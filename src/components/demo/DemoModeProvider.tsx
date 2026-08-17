"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DemoFeedbackHost } from "@/components/demo/DemoFeedbackHost";

export type DemoActionKind =
  | "apply"
  | "save"
  | "bookmark"
  | "completeProfile"
  | "uploadCv";

export type DemoFeedback = {
  id: string;
  kind: DemoActionKind;
  title?: string;
  detail?: string;
};

type ShowDemoOptions = {
  title?: string;
  detail?: string;
};

type DemoModeContextValue = {
  showDemo: (kind: DemoActionKind, options?: ShowDemoOptions) => void;
  dismiss: () => void;
  active: DemoFeedback | null;
};

const DemoModeContext = createContext<DemoModeContextValue | null>(null);

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<DemoFeedback | null>(null);

  const dismiss = useCallback(() => setActive(null), []);

  const showDemo = useCallback(
    (kind: DemoActionKind, options?: ShowDemoOptions) => {
      setActive({
        id: `${kind}-${Date.now()}`,
        kind,
        title: options?.title,
        detail: options?.detail,
      });
    },
    [],
  );

  const value = useMemo(
    () => ({ showDemo, dismiss, active }),
    [showDemo, dismiss, active],
  );

  return (
    <DemoModeContext.Provider value={value}>
      {children}
      <DemoFeedbackHost />
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  const ctx = useContext(DemoModeContext);
  if (!ctx) {
    throw new Error("useDemoMode must be used within DemoModeProvider");
  }
  return ctx;
}
