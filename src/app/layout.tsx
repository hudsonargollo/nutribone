import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { siteUrl } from "@/lib/site";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-provider";
import { ToastProvider } from "@/components/ui/toast";
import { FlashToast } from "@/components/ui/flash-toast";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NutriBone | Caldo de huesos artesanal · Santa Cruz",
    template: "%s | NutriBone",
  },
  description:
    "Caldo de huesos artesanal en Santa Cruz de la Sierra: 48 horas de cocción lenta, 100% natural y sin conservantes. Original, White y Antiinflamatorio. Delivery gratis dentro del 4to anillo.",
  keywords: [
    "NutriBone",
    "caldo de huesos",
    "bone broth",
    "colágeno",
    "caldo antiinflamatorio",
    "nutrición real",
    "Santa Cruz de la Sierra",
    "Bolivia",
    "delivery Santa Cruz",
  ],
  applicationName: "NutriBone",
  openGraph: {
    title: "NutriBone | El poder de sanar en cada sorbo",
    description:
      "Caldo de huesos artesanal: 48 horas de cocción lenta, 100% natural. Delivery gratis dentro del 4to anillo en Santa Cruz de la Sierra.",
    type: "website",
    siteName: "NutriBone",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "NutriBone | El poder de sanar en cada sorbo",
    description:
      "Caldo de huesos artesanal: 48 horas de cocción lenta, 100% natural. Delivery gratis dentro del 4to anillo en Santa Cruz de la Sierra.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <noscript>
          <style>{`.split-word{opacity:1 !important;filter:none !important;transform:none !important}`}</style>
        </noscript>
        {/* Apply saved theme before paint to avoid a flash of the wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('nutribone-theme');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');}else if(t==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();",
          }}
        />
        <ToastProvider>
          <FlashToast />
          <CartProvider>{children}</CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}