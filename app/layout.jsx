import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/header/Navbar";
import { Providers } from "./providers/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SEO Tools App",
  description: "Keyword research, domain insights, autocomplete & more",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen bg-background text-foreground antialiased`}
      >
        <Providers>
          <Navbar />

          <main className="max-w-5xl mx-auto p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
