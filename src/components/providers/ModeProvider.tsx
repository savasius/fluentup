"use client";

import { createContext, useContext } from "react";
import type { AppMode } from "@/lib/mode";

const ModeContext = createContext<AppMode>("adult");

export function ModeProvider({
  mode,
  children,
}: {
  mode: AppMode;
  children: React.ReactNode;
}) {
  return (
    <ModeContext.Provider value={mode}>{children}</ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}
