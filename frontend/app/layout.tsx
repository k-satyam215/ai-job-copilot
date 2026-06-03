import "./globals.css";
import type { Metadata } from "next";
import { ToastProvider } from "../components/ToastProvider";
import NotificationListener from "../components/NotificationListener";

export const metadata: Metadata = {
  title: "AI Job Copilot — Your Autonomous Career Agent",
  description: "AI-powered job discovery, auto-apply, and career analytics",
  openGraph: {
    title: "AI Job Copilot",
    description: "Autonomous AI career agent — resume parsing, job scoring, auto-apply",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <NotificationListener />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
