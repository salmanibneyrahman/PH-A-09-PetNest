"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

export default function MainLayout({ children }) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-black text-white">
        {/* Navigation Bar */}
        <Navbar />
        
        {/* Main Content Funnel */}
        <main className="flex-1 pt-16">
          {children}
        </main>
        
        {/* Footer Bar */}
        <Footer />
      </div>
    </AuthProvider>
  );
}
