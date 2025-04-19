import React from "react";
import { Outlet } from "react-router-dom";
import Dashboard from "./Dashboard"; // Assuming Dashboard.jsx is in the same folder

const Layout = () => {
  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-blue-700 to-blue-400">
      <Dashboard /> {/* Dashboard acts as the layout */}

      {/* Child routes will be rendered here */}
      <div className="flex-1 px-4 py-6">
        <Outlet /> {/* This renders the content of nested routes */}
      </div>
    </div>
  );
};

export default Layout;
