"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell, Website, User } from "./AppShell";
import { useDispatch } from "react-redux";
import { AppDispatch, store } from "@/store/store";
import {
  setWebsites as setWebsitesAction,
  setCurrentWebsite as setCurrentWebsiteAction,
} from "@/hooks/slices/websites/WebsiteSlice";
import { clearAttributes } from "@/hooks/slices/attribute/AttributeSlice";
import { clearBrands } from "@/hooks/slices/brand/BrandSlice";
import { clearSegments } from "@/hooks/slices/segment/SegmentSlice";
import { clearCategories } from "@/hooks/slices/category/CategorySlice";

type AppShellClientProps = {
  children: React.ReactNode;
  websites: Website[];
  currentWebsite: Website | null;
  user: User | null;
};

export function AppShellClient({
  children,
  websites,
  currentWebsite: initialCurrentWebsite,
  user,
}: AppShellClientProps) {
  const [currentWebsite, setCurrentWebsite] = useState(initialCurrentWebsite);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // When client receives server-provided websites, save them to Redux
  useEffect(() => {
    if (websites && websites.length > 0) {
      dispatch(setWebsitesAction(websites));
    }
    // also set current website in redux when initialCurrentWebsite is provided
    if (initialCurrentWebsite) {
      dispatch(setCurrentWebsiteAction(initialCurrentWebsite));
    }
  }, [dispatch, websites, initialCurrentWebsite]);

  const resetRedux = () => {
    dispatch(clearAttributes());
    dispatch(clearBrands());
    dispatch(clearSegments());
    dispatch(clearCategories());
  };

  const handleWebsiteChange = async (websiteId: string) => {
    const newWebsite = websites.find((w) => w._id === websiteId) || null;
    console.log("newWebsite", newWebsite);
    setCurrentWebsite(newWebsite);

    startTransition(async () => {
      try {
        // Call API to update the current website cookie
        const response = await fetch("/api/session/website", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ websiteId }),
        });

        if (response.ok) {
          // Clear Redux state first to prevent old data from being used
          resetRedux();
          // Navigate to /admin (which will load fresh data for new website)
          window.location.href = "/admin";
        } else {
          console.error("Failed to update website context");
          // Revert the optimistic update
          setCurrentWebsite(initialCurrentWebsite);
        }
      } catch (error) {
        console.error("Error updating website context:", error);
        // Revert the optimistic update
        setCurrentWebsite(initialCurrentWebsite);
      }
    });
  };

  return (
    <AppShell
      websites={websites}
      currentWebsite={currentWebsite}
      user={user}
      onWebsiteChange={handleWebsiteChange}
    >
      {children}
    </AppShell>
  );
}
