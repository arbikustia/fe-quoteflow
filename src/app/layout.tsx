import React from "react";
import Sidebar from "../components/Sidebar/index";
import Navbar from "../components/Navbar/index";

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function Layout({ children, pageTitle = "Dashboard" }: LayoutProps) {
  return (
    <div className="flex h-screen w-full bg-brand-gray-light overflow-hidden font-sans">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Subtle Background Glows inside main content */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-brand-blue-light rounded-full mix-blend-multiply filter blur-[100px] opacity-40 translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-brand-orange-light rounded-full mix-blend-multiply filter blur-[100px] opacity-30 -translate-x-1/4 translate-y-1/4 pointer-events-none"></div>

        <Navbar pageTitle={pageTitle} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative z-0">
          {children}
        </main>
      </div>
    </div>
  );
}
