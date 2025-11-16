"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoader } from "@/context/LoaderContext";

const RouteLoaderClient = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    // Show loader when route or query changes, hide after next frame + small delay
    const key = `route:${pathname}?${searchParams?.toString() ?? ""}`;
    showLoader("route-change");
    const t = setTimeout(() => hideLoader("route-change"), 300);
    return () => {
      clearTimeout(t);
      hideLoader("route-change");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
};

export default RouteLoaderClient;
