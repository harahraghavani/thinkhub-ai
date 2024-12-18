"use client";

import { PUBLIC_ROUTES, USER_ACCESS_TOKEN } from "@/constant/appConstant";
import { getCookie } from "@/utility/utils/utils";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect } from "react";

const ManageRouteContext = createContext();

const ManageRouteProvider = ({ children }) => {
  // Router
  const router = useRouter();
  const pathname = usePathname();
  const sharedChatPathname = pathname?.split("/")[1];
  const isSharedChat = sharedChatPathname === "share";

  // COOKIE DATA
  const accessToken = getCookie(USER_ACCESS_TOKEN);

  useEffect(() => {
    if (accessToken && pathname === "/login") {
      router.push("/");
    }
  }, [accessToken, pathname, router]);

  useEffect(() => {
    if (!accessToken && !PUBLIC_ROUTES.includes(pathname) && !isSharedChat) {
      router.push("/");
    }
  }, [accessToken, pathname, router, isSharedChat]);

  const values = {};

  return (
    <ManageRouteContext.Provider value={values}>
      {children}
    </ManageRouteContext.Provider>
  );
};

export { ManageRouteContext, ManageRouteProvider };
