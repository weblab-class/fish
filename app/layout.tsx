import type { Metadata } from "next";
import { Gamja_Flower } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactQueryProvider from "@/services/react-query/ReactQueryProvider";

const gamja = Gamja_Flower({ subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "fish",
  description: "This is temporary.",
  icons: {
    icon: "/icons/fishIcon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={gamja.className}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
