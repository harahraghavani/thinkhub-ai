"use client";

import { ChangeModelProvider } from "@/context/ChangeModel/ChangeModelContext";
import { ManageRouteProvider } from "@/context/ManageRoute/ManageRouteContext";
import { MessageProvider } from "@/context/message/MessagesContext";
// import { FirebaseProvider } from "@/context/Firebase/FirebaseContext";
import { ChakraProvider } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const FirebaseProvider = dynamic(
  () =>
    import("../context/Firebase/FirebaseContext").then(
      (mod) => mod.FirebaseProvider
    ),
  { ssr: false }
);

export function Providers({ children }) {
  return (
    <ChakraProvider>
      <ManageRouteProvider>
        <ChangeModelProvider>
          <MessageProvider>
            <FirebaseProvider>{children}</FirebaseProvider>
          </MessageProvider>
        </ChangeModelProvider>
      </ManageRouteProvider>
    </ChakraProvider>
  );
}
