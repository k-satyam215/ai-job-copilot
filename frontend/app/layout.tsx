import "./globals.css";

export const metadata = {
  title: "AI Job Copilot",
  description: "Autonomous AI career agent",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
