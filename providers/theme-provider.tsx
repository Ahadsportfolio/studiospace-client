"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="studiospace-light"
      disableTransitionOnChange
      enableSystem={false}
      themes={["studiospace-light", "studiospace-dark"]}
    >
      {children}
    </NextThemesProvider>
  );
}
