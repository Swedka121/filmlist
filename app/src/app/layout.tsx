import type { Metadata } from "next";
import { Bebas_Neue, JetBrains_Mono, Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ClientLayout } from "@/components/layouts/ClientLayout";
import Header from "@/components/blocks/Header";
import { Container } from "@/components/layouts/Container";

const bebasNeueFont = Bebas_Neue({ weight: "400", variable: "--font-bebas" });

const geistSans = Montserrat({
  variable: "--font-sans",
  weight: ["100", "400", "600", "800"],
});

const geistMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const pixelFont = localFont({
  src: "./fonts/pixel.woff2",
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "FilmList",
  description: "Service for manage your film lists",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bebasNeueFont.variable} ${pixelFont.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <ClientLayout>
          <Header />
          <Container>{children}</Container>
        </ClientLayout>
      </body>
    </html>
  );
}
