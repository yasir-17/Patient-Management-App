import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { cn } from '@/lib/utils';
import { ThemeProvider } from "next-themes";

const fonts_jakarta = Plus_Jakarta_Sans({
   subsets: ["latin"],
   weight: ['300', '400', '500', '600', '700'],
   variable: '--fonts-sans'
  }
);

export const metadata: Metadata = {
  title: "MediSync",
  description: "Patient Management App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-dark-300 font-sans antialised', fonts_jakarta.variable)}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
        >
          {children}
        </ThemeProvider>
        </body>
    </html>
  );
}
