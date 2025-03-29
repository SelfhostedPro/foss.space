import React from "react";
import { Link } from "@tanstack/react-router";
import { Separator } from "@workspace/ui/components/separator";
import Header from "./Header";
import { useSession } from "@/hooks/use-auth";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useSession();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r hidden md:block p-4">
          <div className="font-medium mb-2">Navigation</div>
          <nav className="space-y-1">
            <Link
              to="/"
              className="block py-1 px-2 rounded hover:bg-muted text-sm"
            >
              Home
            </Link>
            <Link
              to="/categories"
              className="block py-1 px-2 rounded hover:bg-muted text-sm"
            >
              Categories
            </Link>
            <Link
              to="/tags"
              className="block py-1 px-2 rounded hover:bg-muted text-sm"
            >
              Tags
            </Link>
            {user && (
              <Link
                to="/profile"
                className="block py-1 px-2 rounded hover:bg-muted text-sm"
              >
                My Profile
              </Link>
            )}
          </nav>
          <Separator className="my-4" />
          <div className="font-medium mb-2">Demo Pages</div>
          <nav className="space-y-1"></nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 container mx-auto">{children}</main>
      </div>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} FossSpace Forum. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
