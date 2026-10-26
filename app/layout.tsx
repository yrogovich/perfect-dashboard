import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LiveProvider } from "@/components/live";
import { Sidebar } from "@/components/shell/sidebar";
import { Header } from "@/components/shell/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pretty CMS",
  description: "A fast, animated content-analytics dashboard demo.",
};

// Runs before paint so the saved theme and sidebar mode never flash.
const prefsScript = `try{var d=document.documentElement,t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))d.classList.add("dark");d.dataset.sidebar=localStorage.getItem("sidebar")||"wide"}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsScript }} />
      </head>
      <body className="min-h-full">
        <TooltipProvider>
          <LiveProvider>
            <Sidebar />
            <div className="app-content">
              {/* Snapshotted on sidebar toggle; it moves, unlike the padded wrapper. */}
              <div className="app-main flex min-h-screen flex-col">
                <Header />
                {children}
              </div>
            </div>
          </LiveProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
