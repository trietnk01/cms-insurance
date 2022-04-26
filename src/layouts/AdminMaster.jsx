import React from "react";
import { Outlet } from "react-router-dom";

function AdminMaster() {
  return (
    <div className="flex">
      <div>Menu</div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminMaster;
