import type { Metadata } from "next";
import {Outfit} from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import Providers from '@/components/layout/Providers';
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={outfit.className}
      >
        <Providers>
        {children}
        <Toaster />
        </Providers>
      </body>
    </html>
  );
}
