"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage,
} from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Menu, X, LayoutDashboard, Users, Settings, Bell, Search, ChevronDown, Shield, BarChart3, FileText, Star
} from "lucide-react";
import { FaMotorcycle } from "react-icons/fa";

const AdminNav = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);
  const [unseenReservations, setUnseenReservations] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);


  const navigationLinks = [
    { href: "/admin/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/reservations", label: "Reservations", icon: FileText },
    { href: "/admin/renters", label: "Renters", icon: Users },
    { href: "/admin/reviews", label: "Reviews", icon: Star },
    { href: "/admin/scooters", label: "Scooters", icon: FaMotorcycle },
  ];

  return (
    <header className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50 shadow-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4">
        {/* Logo & Brand */}
        <Link href="/admin" className="flex items-center gap-3 hover:opacity-90 transition-all duration-200 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-white">Admin Portal</h1>
            <p className="text-xs text-slate-400">Management Dashboard</p>
          </div>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-700/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 group">
                <Avatar className="w-10 h-10 ring-2 ring-blue-500/50 shadow-lg group-hover:ring-blue-400 transition-all duration-200">
                  <AvatarImage
                    className="object-cover"
                    src={user?.image ?? "https://github.com/shadcn.png"}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {user?.name?.[0]?.toUpperCase() ?? "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-white truncate max-w-32">
                    {user?.name ?? "Admin"}
                  </p>
                  <p className="text-xs text-slate-400">
                    Administrator
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors duration-200" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-72 mt-2 shadow-2xl border border-slate-700 bg-slate-800/95 backdrop-blur-xl rounded-xl">
              <DropdownMenuLabel className="px-4 py-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <Avatar className="w-14 h-14 ring-2 ring-blue-500/50">
                    <AvatarImage
                      src={user?.image ?? "https://github.com/shadcn.png"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                      {user?.name?.[0]?.toUpperCase() ?? "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">
                      {user?.name ?? "Administrator"}
                    </p>
                    <p className="text-sm text-slate-300 truncate">
                      {user?.email ?? "admin@example.com"}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-400">Online</span>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-slate-700" />

              <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200">
                <User className="w-4 h-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200">
                <Settings className="w-4 h-4" />
                <span>Admin Settings</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200">
                <Shield className="w-4 h-4" />
                <span>Security</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-slate-700" />

              <DropdownMenuItem
                onClick={() => signOut()}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 rounded-b-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800/95 backdrop-blur-xl border-t border-slate-700/50 shadow-2xl">

          {/* Mobile Links */}
          <div className="px-4 pb-6 space-y-2">
            {navigationLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group"
                >
                  <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminNav;
