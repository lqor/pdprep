import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Providers from "./providers";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "pdprep",
  description:
    "Practice questions, mock exams, and progress tracking for Salesforce PD1 and PD2 certifications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-bgPrimary text-textPrimary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
