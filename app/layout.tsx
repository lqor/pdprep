import type { Metadata } from "next";
import Providers from "./providers";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "pdprep",
  description:
    "Practice questions, mock exams, and progress tracking for the Salesforce PD1 certification.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bgPrimary text-textPrimary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
