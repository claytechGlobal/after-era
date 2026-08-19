import type { Metadata } from "next";
import { Archivo, Cormorant_Garamond, Inter } from "next/font/google";
import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/components/CartProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-archivo" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--font-cormorant" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "A.F.T.E.R. ERA",
  description: "Wear your rise. Premium made-to-order fashion from A.F.T.E.R. ERA.",
  icons: { icon: "/logo.png" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${cormorant.variable} ${inter.variable} font-sans antialiased bg-paper text-ink`}>
        <CartProvider>
          <div className="bg-ink text-paper/90 text-center text-[10px] tracking-[0.28em] uppercase py-2.5">
            Free shipping over $75 &nbsp;·&nbsp; Made to order &nbsp;·&nbsp; Wear your rise
          </div>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
