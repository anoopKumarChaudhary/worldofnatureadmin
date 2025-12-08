import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "./redux/provider";
import SmoothScroll from "./components/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "World of Nature Admin",
  description: "Admin dashboard for World of Nature",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${manrope.variable} antialiased`}
      >
        <SmoothScroll />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
