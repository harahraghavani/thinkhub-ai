import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/provider/Provider";
import { Rubik } from "next/font/google";
import "./globals.css";

const montserrat = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata = {
  title: "IntelliHub AI",
  description: "Generative AI web app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
