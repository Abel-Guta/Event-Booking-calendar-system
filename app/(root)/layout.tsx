import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className=" w-full bg-black/3 ">
        <SidebarTrigger className="fixed" />
        <div className="px-10 py-5">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default layout;
