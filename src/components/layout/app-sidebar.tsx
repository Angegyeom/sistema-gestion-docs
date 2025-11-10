"use client";

import type { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  GaugeCircle,
  LayoutDashboard,
  Lightbulb,
  TrendingUp,
  SlidersHorizontal,
  Code2,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { ViewType } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  activeView: ViewType;
  setActiveView: Dispatch<SetStateAction<ViewType>>;
};

const navItems = [
  { view: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { view: "advisor", icon: Lightbulb, label: "AI Advisor" },
  { view: "forecasting", icon: TrendingUp, label: "Forecasting" },
  { view: "profiler", icon: SlidersHorizontal, label: "Profiler" },
  { view: "analysis", icon: Code2, label: "Code Analysis" },
  { view: "alerts", icon: Bell, label: "Alerts" },
] as const;

export default function AppSidebar({ activeView, setActiveView }: AppSidebarProps) {
  const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");

  return (
    <Sidebar collapsible="icon" className="group" variant="sidebar">
      <SidebarHeader className="h-16 p-4">
        <Link href="/" className="flex items-center gap-2">
          <GaugeCircle className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold group-data-[collapsible=icon]:hidden">
            OptimoSystem
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.view}>
              <SidebarMenuButton
                onClick={() => setActiveView(item.view)}
                isActive={activeView === item.view}
                tooltip={item.label}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "flex h-auto w-full items-center justify-start gap-3 p-2",
                "group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center"
              )}
            >
              <Avatar className="h-10 w-10">
                {userAvatar && (
                  <AvatarImage
                    src={userAvatar.imageUrl}
                    alt={userAvatar.description}
                    data-ai-hint={userAvatar.imageHint}
                    width={100}
                    height={100}
                  />
                )}
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="text-left group-data-[collapsible=icon]:hidden">
                <p className="font-semibold">Admin</p>
                <p className="text-xs text-muted-foreground">admin@optimo.com</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@optimo.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
