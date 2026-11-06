"use client";

import {
  ChevronDown,
  CalendarDays,
  FileText,
  LayoutDashboard,
  LogOut,
  LoaderCircle,
  Menu,
  Plus,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Brand } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/providers/auth-provider";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
];

const accountLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Add New Studio", href: "/add-studio", icon: Plus },
  { label: "My Studio Listings", href: "/my-listings", icon: FileText },
  { label: "My Bookings", href: "/my-bookings", icon: CalendarDays },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  const closeMenu = () => setMobileMenuOpen(false);
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to sign out.",
      );
      return;
    }
    closeMenu();
    toast.success("You have been signed out.");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-base-300/70 bg-base-100/95 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
        <Brand />

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {navigation.map(({ href, label }) => (
            <Link
              aria-current={isActive(href) ? "page" : undefined}
              className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:bg-base-200 ${
                isActive(href) ? "text-primary" : "text-base-content/75"
              }`}
              href={href}
              key={href}
            >
              {label}
              {isActive(href) && (
                <span className="absolute inset-x-3.5 -bottom-[1.05rem] h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          {loading ? (
            <span
              aria-label="Loading account"
              className="flex h-10 w-28 items-center justify-center rounded-full bg-base-200 text-base-content/50"
            >
              <LoaderCircle aria-hidden="true" className="animate-spin" size={18} />
            </span>
          ) : user ? (
            <div className="dropdown dropdown-end">
              <button
                className="btn btn-ghost h-11 gap-2 rounded-full px-2"
                type="button"
              >
                <span className="avatar">
                  <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-secondary text-sm font-semibold text-secondary-content">
                    {user.image ? (
                      <Image
                        alt=""
                        className="h-full w-full object-cover"
                        height={32}
                        src={user.image}
                        unoptimized
                        width={32}
                      />
                    ) : (
                      user.name.slice(0, 1).toUpperCase()
                    )}
                  </span>
                </span>
                <span className="max-w-28 truncate text-sm">{user.name}</span>
                <ChevronDown aria-hidden="true" size={16} />
              </button>
              <ul className="menu dropdown-content z-10 mt-3 w-60 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-xl">
                <li className="menu-title px-3 py-2">
                  <span className="truncate">{user.email}</span>
                </li>
                {accountLinks.map(({ href, icon: Icon, label }) => (
                  <li key={href}>
                    <Link href={href}>
                      <Icon aria-hidden="true" size={17} />
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button onClick={handleLogout} type="button">
                    <LogOut aria-hidden="true" size={17} />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link className="button-secondary !min-h-10 !px-5 !py-2 text-sm" href="/login">
                Login
              </Link>
              <Link className="button-primary !min-h-10 !px-5 !py-2 text-sm" href="/register">
                Register
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            aria-controls="mobile-navigation"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="btn btn-ghost btn-circle"
            onClick={() => setMobileMenuOpen((open) => !open)}
            type="button"
          >
            {mobileMenuOpen ? (
              <X aria-hidden="true" size={21} />
            ) : (
              <Menu aria-hidden="true" size={21} />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-base-300 bg-base-100 px-5 py-4 shadow-lg lg:hidden"
          id="mobile-navigation"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigation.map(({ href, label }) => (
              <Link
                aria-current={isActive(href) ? "page" : undefined}
                className={`rounded-xl px-4 py-3 text-sm font-medium ${
                  isActive(href)
                    ? "bg-primary/10 text-primary"
                    : "text-base-content/80 hover:bg-base-200"
                }`}
                href={href}
                key={href}
                onClick={closeMenu}
              >
                {label}
              </Link>
            ))}

            {loading ? (
              <span
                aria-label="Loading account"
                className="mt-3 flex h-11 items-center justify-center border-t border-base-300 pt-4 text-base-content/50"
              >
                <LoaderCircle aria-hidden="true" className="animate-spin" size={18} />
              </span>
            ) : user ? (
              <>
                <div className="mt-2 border-t border-base-300 px-4 py-4">
                  <p className="font-semibold">{user.name}</p>
                  <p className="mt-1 truncate text-sm text-base-content/60">
                    {user.email}
                  </p>
                </div>
                {accountLinks.map(({ href, label }) => (
                  <Link
                    className="rounded-xl px-4 py-3 text-sm hover:bg-base-200"
                    href={href}
                    key={href}
                    onClick={closeMenu}
                  >
                    {label}
                  </Link>
                ))}
                <button
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm text-error hover:bg-base-200"
                  onClick={handleLogout}
                  type="button"
                >
                  <LogOut aria-hidden="true" size={17} />
                  Logout
                </button>
              </>
            ) : (
              <div className="mt-3 flex gap-3 border-t border-base-300 pt-4">
                <Link
                  className="button-secondary min-h-11 flex-1"
                  href="/login"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  className="button-primary min-h-11 flex-1"
                  href="/register"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
