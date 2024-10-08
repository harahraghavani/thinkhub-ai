import { Providers } from "@/provider/Provider";
import "./globals.css";

export const metadata = {
  title: "IntelliHub AI",
  description: "Generative AI web app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
