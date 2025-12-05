"use client";

import {
  Home,
  Inbox,
  LogOut,
  Settings,
  Ticket,
  PlusCircle,
  Calendar,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { logout } from "@/lib/helpers/auth-helpers";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "My Events", url: "/my_events", icon: Inbox },
  { title: "My Bookings", url: "/bookings", icon: Ticket },
  { title: "Logout", url: "/signIn", icon: LogOut },
];

export function AppSidebar() {
  const pathname = usePathname();

  const [user, setUser] = useState<{ name: string; email?: string } | null>(
    null
  );

  useEffect(() => {
    async function getCurrentUser() {
      const supabase = createClient();
      const { data: authdata } = await supabase.auth.getUser();

      const email = authdata?.user?.email;
      if (!email) return null;

      const { data, error } = await supabase
        .from("Users")
        .select("name")
        .eq("email", email)
        .single();

      if (error) throw new Error(error.message);

      return { name: data.name, email };
    }

    async function loaduser() {
      const userData = await getCurrentUser();
      setUser(userData);
    }

    loaduser();
  }, []);
  const router = useRouter();
  return (
    <Sidebar
      className="backdrop-blur-xl border-r border-black/10 z-10 h-full"
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-26">
            <div className="flex items-center gap-5 mt-5 mx-auto px-7 py-2 rounded-xl bg-linear-to-r from-red-500 via-orange-400 to-yellow-300 shadow-md cursor-pointer select-none transition-all duration-300 hover:scale-[1.03] hover:shadow-lg">
              <Calendar className="w-7 h-7 text-white drop-shadow" />
              <h2 className="text-2xl font-extrabold text-white drop-shadow-sm tracking-tight">
                EvCal
              </h2>
            </div>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        onClick={async () => {
                          if (item.title != "Logout") return;

                          logout();
                          router.push("signIn");
                        }}
                        href={item.url}
                        className={`flex items-center gap-3 px-4 py-2 transition-all mb-9 ${
                          active
                            ? "bg-linear-to-r from-red-500 via-orange-400 to-yellow-300 text-white shadow"
                            : "hover:bg-black/5"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mr-3 ">
        <SidebarMenuButton asChild>
          <div className="flex items-center px-4 gap-4  mb-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg w-full h-max">
            <div className="w-10  h-10 flex items-center -ml-2 pr-2 justify-center rounded-full bg-orange-500/80 ">
              <User className="w-6 h-6 text-white ml-1" />
            </div>

            <div className="flex flex-col">
              <p className="text-black/60 font-semibold text-sm">
                {user?.name ?? "Loading..."}
              </p>
              <p className="text-black/40 text-xs">
                {user?.email ?? "Loading..."}
              </p>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
