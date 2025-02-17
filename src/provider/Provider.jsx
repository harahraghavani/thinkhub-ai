"use client";
import { ChangeModelProvider } from "@/context/ChangeModel/ChangeModelContext";
import { ManageRouteProvider } from "@/context/ManageRoute/ManageRouteContext";
import { MessageProvider } from "@/context/message/MessagesContext";
import AuthGuard from "@/hocs/AuthGuard";
import { ChakraProvider, extendTheme, Spinner } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const FirebaseProvider = dynamic(
  () =>
    import("../context/Firebase/FirebaseContext").then(
      (mod) => mod.FirebaseProvider
    ),
  { ssr: false }
);

// Extend the theme to include custom colors, fonts, etc
const theme = extendTheme({
  fonts: {
    heading: "var(--font-rubik)",
    body: "var(--font-rubik)",
  },
});

export function Providers({ children }) {
  return (
    <ChakraProvider theme={theme}>
      <ManageRouteProvider>
        <ChangeModelProvider>
          <MessageProvider>
            <FirebaseProvider>
              <AuthGuard fallback={<Spinner size="xl" />}>{children}</AuthGuard>
            </FirebaseProvider>
          </MessageProvider>
        </ChangeModelProvider>
      </ManageRouteProvider>
    </ChakraProvider>
  );
}
