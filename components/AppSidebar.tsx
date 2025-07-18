"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { CiLogout } from "react-icons/ci";
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "./ui/button";
import { useSession, signOut } from "next-auth/react";
import { ChevronRight, User, Shield, Activity } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { adminLinks } from "@/constants/constants";

const AppSidebar = () => {
    const { data: session } = useSession();
    const user = session?.user;
    const pathName = usePathname();

    return (
        <Sidebar className='flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/30 shadow-2xl'>
            {/* Enhanced Header with Branding */}
            <SidebarHeader className='px-6 py-8 border-b border-slate-700/40'>
                {/* Logo/Brand Section */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-white">Admin</h1>
                        <p className="text-sm text-slate-400">Control Panel</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>

                {/* User Profile Section */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                        {user?.image ? (
                            <img
                                src={user.image}
                                alt="User avatar"
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <User size={20} className="text-white" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate text-sm">
                            {user?.name || "Administrator"}
                        </p>
                        <p className="text-slate-400 text-xs truncate">
                            {user?.email || "admin@system.com"}
                        </p>
                    </div>
                </div>

                {/* Menu Label */}
                <div className="mt-6 mb-2">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Main Menu
                        </span>
                    </div>
                </div>
            </SidebarHeader>

            {/* Enhanced Navigation Links */}
            <SidebarContent className='flex-1 px-4 py-6'>
                <nav className="space-y-2">
                    {adminLinks.map((link) => {
                        const isActive = link.path === pathName;
                        return (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`
                                    group relative flex items-center gap-4 px-4 py-3.5 rounded-xl
                                    transition-all duration-300 ease-in-out
                                    ${isActive
                                        ? "bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]"
                                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:transform hover:scale-[1.01]"
                                    }
                                `}
                            >
                                {/* Active indicator line */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-10 bg-white rounded-r-full shadow-lg" />
                                )}

                                {/* Icon with enhanced styling */}
                                <div className={`
                                    flex items-center justify-center w-8 h-8 rounded-lg
                                    ${isActive
                                        ? "bg-white/20 text-white shadow-inner"
                                        : "text-slate-400 group-hover:text-white group-hover:bg-slate-600/30"
                                    }
                                    transition-all duration-300
                                `}>
                                    <link.icon size={20} />
                                </div>

                                {/* Link text with better typography */}
                                <span className="font-medium flex-1 tracking-wide">
                                    {link.name}
                                </span>

                                {/* Enhanced active state indicator */}
                                {isActive && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                                        <ChevronRight size={16} className="text-white/70" />
                                    </div>
                                )}

                                {/* Hover glow effect */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:via-purple-600/5 group-hover:to-blue-600/5 transition-all duration-300" />
                            </Link>
                        );
                    })}
                </nav>
            </SidebarContent>

            {/* Enhanced Footer */}
            <SidebarFooter className='px-4 py-6 border-t border-slate-700/40'>
                {/* System Status */}
                <div className="mb-4 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-slate-400">System Status</span>
                        </div>
                        <span className="text-xs text-green-400 font-medium">Online</span>
                    </div>
                </div>

                {/* Enhanced Logout Button */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            className="
                                group w-full flex items-center justify-start gap-4 px-4 py-3.5
                                text-slate-300 hover:text-red-300 hover:bg-red-500/10
                                transition-all duration-300 ease-in-out rounded-xl
                                border border-slate-700/30 hover:border-red-500/30
                                hover:shadow-lg hover:shadow-red-500/10
                                hover:transform hover:scale-[1.02]
                            "
                        >
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg group-hover:bg-red-500/10 transition-all duration-300">
                                <CiLogout size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                            </div>
                            <span className="font-medium flex-1 text-left">Sign Out</span>
                            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full group-hover:bg-red-400 transition-colors duration-300"></div>
                        </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Sign out?</AlertDialogTitle>
                            <AlertDialogDescription>
                            Are you sure you want to sign out as an admin?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className='bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/30' onClick={() => signOut()}>Yes, Sign out</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Version Info */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-slate-500">
                        Admin Dashboard
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                        v2.1.0
                    </p>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar
