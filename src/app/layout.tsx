import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "ABSMOGGLE",
  description:
    "Competitive live 1v1 fitness battles with privacy-first abdominal definition scanning.",
  applicationName: "ABSMOGGLE",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
};

export const viewport: Viewport = {
  themeColor: "#030508",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
