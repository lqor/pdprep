import type { Metadata } from "next";
import Providers from "./providers";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "PDPrep - Free Salesforce PD1 Exam Prep",
  description:
    "Pass Salesforce PD1 on the first try. 93 exam-accurate practice questions, timed mock exams, and detailed explanations linked to official Salesforce docs. Free forever.",
  icons: {
    icon: "/favicon.svg",
  },
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
