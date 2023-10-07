import "./globals.css";
import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import ToasterProvider from "./components/Providers/ToasterProvider";

const inter = Inter({ subsets: ["latin"] });
const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Final Project - Marco Bonafini",
  description: "Stock Competiti",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <div className="pb-20 pt-28">{children}</div>
      </body>
    </html>
  );
}
