"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const lightTheme = "studiospace-light";
const darkTheme = "studiospace-dark";
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  if (!mounted) {
    return (
      <button
        aria-hidden="true"
        className="btn btn-ghost btn-circle"
        disabled
        tabIndex={-1}
        type="button"
      />
    );
  }

  const isDark = theme === darkTheme;
  const LabelIcon = isDark ? Sun : Moon;
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      aria-label={label}
      className="btn btn-ghost btn-circle text-base-content"
      onClick={() => setTheme(isDark ? lightTheme : darkTheme)}
      title={label}
      type="button"
    >
      <LabelIcon aria-hidden="true" size={20} />
    </button>
  );
}
