"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import profile from "@/public/boy.png"

interface SidebarFooterProps {
    collapsed?: boolean;
}

export function SidebarFooter({
    collapsed = false,
}: SidebarFooterProps) {
    return (
        <div
            className={cn(
                "flex items-center gap-3 overflow-hidden transition-all duration-300",
                collapsed ? "justify-center px-3 py-3" : "px-4 py-3"
            )}
        >
            {/* Avatar */}
            <div className="relative shrink-0">
                <Image
                    src={profile}
                    alt='profile'
                    width={36}
                    height={36}
                    className="rounded-full object-cover ring-2 ring-border shrink-0"
                />
            </div>

            {/* Name + Email */}
            <AnimatePresence mode="wait">
                {!collapsed && (
                    <motion.div
                        key="profile-text"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="flex flex-col min-w-0"
                    >
                        <span className="text-sm font-semibold text-foreground truncate leading-tight">
                            Deepak Kumar
                        </span>
                        
                        <span className="text-xs text-muted-foreground truncate leading-tight">
                            deepaksingh73229@gmail.com
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}