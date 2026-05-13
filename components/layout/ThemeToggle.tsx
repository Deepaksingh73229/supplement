'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-muted/60 bg-background/50">
                <span className="opacity-0">
                    <Sun className="h-4 w-4" />
                </span>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="relative h-10 w-10 rounded-full border-muted/60 bg-background/50 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 overflow-hidden"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={theme}
                            initial={{ y: -20, opacity: 0, rotate: -90 }}
                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                            exit={{ y: 20, opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            {theme === 'dark' ? (
                                <Moon className="h-4 w-4 text-foreground" />
                            ) : theme === 'light' ? (
                                <Sun className="h-4 w-4 text-foreground" />
                            ) : (
                                <Monitor className="h-4 w-4 text-foreground" />
                            )}
                        </motion.div>
                    </AnimatePresence>
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40 rounded-xl p-1.5 shadow-xl border-muted/60">
                {(['light', 'dark', 'system'] as const).map((t) => (
                    <DropdownMenuItem
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`flex items-center justify-between px-3 py-2.5 cursor-pointer rounded-lg transition-colors mb-0.5 last:mb-0 ${theme === t
                            ? 'bg-primary/10 text-primary font-medium focus:bg-primary/15'
                            : 'text-muted-foreground focus:bg-muted/50'
                            }`}
                    >
                        <div className="flex items-center gap-2.5">
                            {t === 'light' && <Sun className="h-4 w-4" />}
                            {t === 'dark' && <Moon className="h-4 w-4" />}
                            {t === 'system' && <Monitor className="h-4 w-4" />}
                            <span className="capitalize">{t}</span>
                        </div>
                        {theme === t && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <Check className="h-4 w-4" />
                            </motion.div>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}