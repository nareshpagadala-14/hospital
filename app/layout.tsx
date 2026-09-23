import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "AIMS Prime Super Speciality Hospital | Guntur, Andhra Pradesh",
  description:
    "Leading multi-speciality hospital in Guntur, AP. 24/7 Emergency & Level-1 Trauma Care, Cardiology Cath Lab, Robotic Joint Replacement, and online appointment booking.",
  keywords: [
    "Hospital in Guntur",
    "Best Hospital in Guntur",
    "Multi speciality hospital in Guntur",
    "Cardiologist in Guntur",
    "Emergency hospital in Guntur",
    "AIMS Prime Hospital Guntur",
  ],
  openGraph: {
    title: "AIMS Prime Super Speciality Hospital | Guntur",
    description: "Advanced Healthcare. Compassionate Care. 24/7 Emergency & Specialist Consultations.",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
