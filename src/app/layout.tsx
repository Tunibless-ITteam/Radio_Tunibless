import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { createClient } from '@/utils/supabase/server'
import RadioPlayer from '@/components/RadioPlayer'

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tunibless",
  description: "Tunibless Dashboard and Public Pages",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient()
  const { data: radioSettings } = await supabase.from('radio_settings').select('*').single()

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} antialiased bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display`}>
        {children}
        {radioSettings && <RadioPlayer initialSettings={radioSettings} />}
      </body>
    </html>
  );
}
