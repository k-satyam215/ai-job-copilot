import "./globals.css";
import type { Metadata } from "next";
import { ToastProvider } from "../components/ToastProvider";
import NotificationListener from "../components/NotificationListener";

export const metadata: Metadata = {
  title: "AI Job Copilot — India's #1 AI Career Agent",
  description: "Upload your resume once. AI discovers matched jobs across 20+ portals, auto-fills every application in 4 seconds, and tracks every outcome — all in one command center.",
  keywords: ["AI job search", "job copilot", "auto apply jobs", "naukri alternative", "AI career agent", "resume parser", "job matching AI", "India jobs AI"],
  authors: [{ name: "AI Job Copilot" }],
  creator: "AI Job Copilot",
  openGraph: {
    title: "AI Job Copilot — Stop applying manually. Let AI land your dream job.",
    description: "India's most advanced AI career platform. Resume parsing, job matching, auto-fill, interview prep, career roadmap — all in one place.",
    type: "website",
    url: "https://ai-job-copilot-psi.vercel.app",
    siteName: "AI Job Copilot",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Job Copilot — India's #1 AI Career Agent",
    description: "Stop applying manually. Let AI land your dream job.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <ToastProvider>
          <NotificationListener />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
