import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";
import { themeScript } from "@/lib/theme";

const heading = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-heading", display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata = {
  title: { default: "RentRig — Rent the right equipment, right on time", template: "%s | RentRig" },
  description:
    "RentRig connects verified equipment owners with people who need construction, photography, agriculture, event and electronic equipment – book by the day, week or month with secure Stripe payments.",
  keywords: ["equipment rental", "rent camera", "rent excavator", "event equipment", "Bangladesh rental marketplace"],
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1420" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="rentrig" suppressHydrationWarning className={`${heading.variable} ${body.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
