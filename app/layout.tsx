import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amity University, Jaipur — Rajasthan Campus",
  description:
    "152 acres in the Aravali hills. Amity University, Rajasthan brings together academics, research, and campus life — a place built to take ambition seriously.",
  keywords: [
    "Amity University Rajasthan",
    "Amity University Jaipur",
    "private university India",
    "engineering college Rajasthan",
    "MBA Jaipur",
    "law school Rajasthan",
    "university admissions",
  ],
  authors: [{ name: "Amity University, Rajasthan" }],
  openGraph: {
    title: "Amity University, Jaipur — Rajasthan Campus",
    description:
      "A 152-acre campus in the Aravali hills, built for research, recreation, and results.",
    type: "website",
    locale: "en_IN",
    siteName: "Amity University Rajasthan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amity University, Jaipur — Rajasthan Campus",
    description: "152 acres in the Aravali hills. Built to take ambition seriously.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
