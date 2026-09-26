import React from "react";
import Sidebar from "../components/Sidebar/index";
import Navbar from "../components/Navbar/index";

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-full w-full bg-white overflow-hidden font-sans text-brand-text-dark">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-white">
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative z-0">
          {children}
        </main>
      </div>
    </div>
  );
}
