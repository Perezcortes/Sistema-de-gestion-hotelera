// src/layouts/DashboardLayout.tsx
import React from "react";
import TopBar from "./components/TopBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar />
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;
