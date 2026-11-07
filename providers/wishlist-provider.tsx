"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import type { Studio } from "@/types/studio";

export type WishlistContextValue = {
  wishlist: Studio[];
  wishlistIds: Set<string>;
  loading: boolean;
  isSaved: (studioId: string) => boolean;
  toggleWishlist: (studio: Studio) => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);
const EMPTY_SET = new Set<string>();

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [wishlist, setWishlist] = useState<Studio[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(EMPTY_SET);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchedUserEmail = useRef<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (authLoading || !user) {
      return;
    }

    if (fetchedUserEmail.current === user.email) {
      return;
    }

    async function loadWishlist() {
      setLoading(true);
      try {
        const data = await apiFetch<Studio[]>("api/wishlist");
        if (isCancelled) return;
        if (Array.isArray(data)) {
          setWishlist(data);
          setWishlistIds(new Set(data.map((item) => String(item._id))));
        } else {
          setWishlist([]);
          setWishlistIds(new Set());
        }
        fetchedUserEmail.current = user?.email ?? null;
      } catch (error) {
        console.error("[Wishlist] Failed to fetch saved studios:", error);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadWishlist();

    return () => {
      isCancelled = true;
    };
  }, [user, authLoading]);

  const refreshWishlist = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await apiFetch<Studio[]>("api/wishlist");
      if (Array.isArray(data)) {
        setWishlist(data);
        setWishlistIds(new Set(data.map((item) => String(item._id))));
      }
    } catch (error) {
      console.error("[Wishlist] Failed to refresh saved studios:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const activeWishlist = useMemo(
    () => (user ? wishlist : []),
    [user, wishlist]
  );
  const activeWishlistIds = useMemo(
    () => (user ? wishlistIds : EMPTY_SET),
    [user, wishlistIds]
  );

  const isSaved = useCallback(
    (studioId: string) => {
      if (!studioId || !user) return false;
      return activeWishlistIds.has(String(studioId));
    },
    [activeWishlistIds, user]
  );

  const toggleWishlist = useCallback(
    async (studio: Studio): Promise<boolean> => {
      if (!user?.email) {
        toast.info("Please sign in to save studios to your wishlist", {
          description: "Create an account or login to bookmark creative spaces.",
        });
        return false;
      }

      const studioIdStr = String(studio._id);
      const wasSaved = activeWishlistIds.has(studioIdStr);
      const nextSaved = !wasSaved;

      // Capture previous state for rollback
      const prevWishlist = wishlist;
      const prevIds = new Set(wishlistIds);

      // 1. Optimistic update
      const newIds = new Set(wishlistIds);
      if (nextSaved) {
        newIds.add(studioIdStr);
        setWishlistIds(newIds);
        setWishlist([
          studio,
          ...wishlist.filter((s) => String(s._id) !== studioIdStr),
        ]);
        toast.success("Saved to your wishlist", {
          description: studio.title,
        });
      } else {
        newIds.delete(studioIdStr);
        setWishlistIds(newIds);
        setWishlist(wishlist.filter((s) => String(s._id) !== studioIdStr));
        toast.info("Removed from saved studios", {
          description: studio.title,
        });
      }

      // 2. Perform server request
      try {
        const response = await apiFetch<{
          message: string;
          saved: boolean;
          studioId: string;
        }>(`api/wishlist/${studioIdStr}`, {
          method: "POST",
        });

        // Ensure state matches server response if provided
        if (response && typeof response.saved === "boolean") {
          if (response.saved !== nextSaved) {
            if (response.saved) {
              setWishlistIds((curr) => new Set(curr).add(studioIdStr));
            } else {
              setWishlistIds((curr) => {
                const updated = new Set(curr);
                updated.delete(studioIdStr);
                return updated;
              });
              setWishlist((curr) =>
                curr.filter((s) => String(s._id) !== studioIdStr)
              );
            }
          }
        }

        return nextSaved;
      } catch (error) {
        // Rollback optimistic update
        setWishlist(prevWishlist);
        setWishlistIds(prevIds);
        toast.error("Could not update wishlist", {
          description:
            error instanceof Error
              ? error.message
              : "Unable to reach server. Please try again.",
        });
        return wasSaved;
      }
    },
    [user, activeWishlistIds, wishlist, wishlistIds]
  );

  const value = useMemo(
    () => ({
      wishlist: activeWishlist,
      wishlistIds: activeWishlistIds,
      loading,
      isSaved,
      toggleWishlist,
      refreshWishlist,
    }),
    [
      activeWishlist,
      activeWishlistIds,
      loading,
      isSaved,
      toggleWishlist,
      refreshWishlist,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
