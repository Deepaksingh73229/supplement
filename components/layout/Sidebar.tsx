'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Microscope,
    Search,
    History,
    Settings,
    FlaskConical,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { SidebarFooter } from './SidebarFooter';

// ─── Custom Icon matching your uploaded design ───
function PanelToggleIcon({ className, direction = 'left' }: { className?: string; direction?: 'left' | 'right' }) {
    return (
        <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            style={{ transform: direction === 'right' ? 'rotate(180deg)' : undefined }}
        >
            <rect x="3" y="4" width="7" height="16" rx="1.5" />
            <rect x="14" y="4" width="7" height="16" rx="1.5" />
        </svg>
    );
}

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/analyze', label: 'Analyze', icon: Microscope },
    { href: '/search', label: 'Semantic Search', icon: Search },
    { href: '/history', label: 'History', icon: History },
    { href: '/settings', label: 'Settings', icon: Settings },
] as const;

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 72 : 260 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="relative flex flex-col border-r bg-card h-screen shrink-0"
        >
            {/* Logo */}
            <div className="flex h-16 items-center border-b px-4">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <FlaskConical className="h-5 w-5" />
                    </div>
                    <AnimatePresence mode="wait">
                        {!collapsed && (
                            <motion.div
                                key="logo-text"
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -6 }}
                                transition={{ duration: 0.2 }}
                                className="font-black text-xl tracking-tight whitespace-nowrap"
                            >
                                Supplement
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative',
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                )}
                            >
                                {isActive && !collapsed && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-primary')} />
                                {!collapsed && (
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={`label-${item.href}`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className="whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    </AnimatePresence>
                                )}
                                {isActive && !collapsed && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="ml-auto h-2 w-2 rounded-full bg-primary"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* ─── Bottom Section: Profile + Floating Toggle ─── */}
            <div className="relative shrink-0 border-t">
                {/* Floating Collapse Toggle — sits ON the right border */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(
                        'absolute z-10 flex items-center justify-center',
                        'h-7 w-7 rounded-full',
                        'bg-background border shadow-sm',
                        'text-muted-foreground hover:text-foreground',
                        'hover:shadow-md hover:scale-105',
                        'transition-all duration-200 ease-out',
                        'focus:outline-none focus:ring-2 focus:ring-primary/20',
                        // Position: centered on the border line
                        'top-0 -translate-y-1/2',
                        collapsed ? 'left-1/2 -translate-x-1/2' : 'right-0 translate-x-1/2'
                    )}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <PanelToggleIcon
                        className="h-3.5 w-3.5"
                        direction={collapsed ? 'right' : 'left'}
                    />
                </button>

                {/* Profile Footer */}
                <SidebarFooter
                    collapsed={collapsed}
                />
            </div>
        </motion.aside>
    );
}