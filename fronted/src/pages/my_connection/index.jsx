import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React from "react";

export default function myConnection() {
  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>my Connections</h1>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
