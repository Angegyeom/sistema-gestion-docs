import AppHeader from "@/components/layout/app-header";
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("font-sans antialiased", "min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2]")}>
        <AppHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
