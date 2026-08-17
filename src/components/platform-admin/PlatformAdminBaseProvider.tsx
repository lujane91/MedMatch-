"use client";

import { createContext, useContext, type ReactNode } from "react";

const PlatformAdminBaseContext = createContext("/medmatch-control");

export function PlatformAdminBaseProvider({
  basePath,
  children,
}: {
  basePath: string;
  children: ReactNode;
}) {
  return (
    <PlatformAdminBaseContext.Provider value={basePath}>
      {children}
    </PlatformAdminBaseContext.Provider>
  );
}

export function usePlatformAdminBasePath() {
  return useContext(PlatformAdminBaseContext);
}
