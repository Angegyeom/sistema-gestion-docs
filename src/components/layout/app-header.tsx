"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import type { ViewType } from "@/lib/types";
import { viewTitles } from "@/lib/types";

type AppHeaderProps = {
  activeView: ViewType;
};

export default function AppHeader({ activeView }: AppHeaderProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(prev => !prev);
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-lg font-semibold md:text-xl">
        {viewTitles[activeView]}
      </h1>
      <div className="ml-auto">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </header>
  );
}
