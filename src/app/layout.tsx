import { Metadata } from "next";
import "./globals.css";
import "./assets/css/base.css";
import { EmailProvider } from '@/app/context/emailContext';
import { ThemeProvider } from './context/ThemeContext';


export const metadata: Metadata = {
  title: {
    default: "BirdEye",
    template: "%s | BirdEye",
  },
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ThemeProvider>
          <EmailProvider>
            {children}
          </EmailProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
