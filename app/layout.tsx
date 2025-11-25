import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { Meteors } from "@/components/ui/meteors";
import { NavDock } from "@/components/nav-dock";
import {Footer} from "@/components/footer";
import { DATA } from "@/data/resume";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ['latin'] })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: "Anvionix Labs",
    template: `%s | Anvionix Labs`,
  },
  description: DATA.description,
  openGraph: {
    title: `${DATA.name}`,
    description: DATA.description,
    url: DATA.url,
    siteName: `${DATA.name}`,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: `${DATA.name}`,
    card: "summary_large_image",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} cursor-none`}>
        <GoogleAnalytics gaId="G-NB9SK23EPY" />

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothCursor />
          <div className="relative h-full w-full overflow-hidden">
            <Meteors number={30} maxDuration={20} minDuration={2} />
            <div>
              {/* <Navigation /> */}
              <NavDock />
              <main className="relative z-10 min-h-screen bg-transparent">
                {children}
              </main>
              <Footer />
            </div>

          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
