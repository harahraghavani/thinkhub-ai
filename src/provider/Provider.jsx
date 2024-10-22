"use client";

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
      <MessageProvider>
        <FirebaseProvider>{children}</FirebaseProvider>
      </MessageProvider>
    </ChakraProvider>
  );
}
