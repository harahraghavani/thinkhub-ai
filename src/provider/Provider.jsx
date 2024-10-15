"use client";

import { FirebaseProvider } from "@/context/Firebase/FirebaseContext";
import { ChakraProvider } from "@chakra-ui/react";

export function Providers({ children }) {
  return (
    <ChakraProvider>
      <FirebaseProvider>{children}</FirebaseProvider>
    </ChakraProvider>
  );
}
