import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
import ClientProviders from "../components/ClinetProviders";

export const metadata: Metadata = {
  title: "St8craft",
  description: "Built by 🏗 OxSnosh",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
