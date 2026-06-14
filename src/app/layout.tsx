import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MimoBot - Cours d'Anglais CEM",
  description:
    "Plateforme interactive de cours d'anglais pour collèges (CEM) en Algérie",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="bg-neutral-50 text-neutral-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
