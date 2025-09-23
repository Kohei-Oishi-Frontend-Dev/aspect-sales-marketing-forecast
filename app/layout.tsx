import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./Navbar";
import QueryProvider from "./components/QueryProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Aspect Sales and Analytics Dashboard",
  description: "Aspect Sales and Analytics Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-gray-50`}
      >
        <Navbar />
        <QueryProvider>{children}</QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
