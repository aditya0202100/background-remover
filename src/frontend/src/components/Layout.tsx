import { Toaster } from "@/components/ui/sonner";
import type { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
      <Toaster richColors position="bottom-center" />
    </div>
  );
}
