"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Users, Video, DollarSign, Share2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SessionUpdater } from "@/components/layout/SessionUpdater";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (status === "loading") return;
    
    console.log("user", session?.user);
    // Check if user is admin
    if (session?.user && (session.user as any).isAdmin) {
      setIsAdmin(true);
    } else {
      // Redirect to dashboard if not admin
      router.push("/dashboard");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  const handleSignOut = async () => {
    // Sign out logic would go here
    router.push("/sign-in");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Videos", href: "/admin/videos", icon: Video },
    { name: "Revenue", href: "/admin/revenue", icon: DollarSign },
    { name: "Referrals", href: "/admin/referrals", icon: Share2 },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={cn(
                    "flex items-center p-2 rounded-lg hover:bg-gray-800 transition-colors",
                    // Add active state styling if needed
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-700">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-gray-800"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Admin Dashboard</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                Welcome, {session?.user?.firstName} {session?.user?.lastName}
              </span>
            </div>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
