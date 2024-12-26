import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/provider/Provider";
import { Lexend } from "next/font/google";
import "./globals.css";

const montserrat = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata = {
  title: "IntelliHub AI",
  description: "Generative AI web app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="keywords"
          content="AI, Generative AI, IntelliHub AI, AI web app"
        />
        <meta name="author" content="Harsh Raghavani" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:url" content="https://intellihub-ai.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
