import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/layouts/Root";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { logout } = useAuth();

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };
return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
      
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header
          onMenuClick={handleMenuClick}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          actions={[
            {
              label: "Logout",
              variant: "secondary",
              icon: "LogOut",
              onClick: logout
            }
          ]}
        />
        
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;