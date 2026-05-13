'use client';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { motion } from 'framer-motion';

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        // Added custom text selection colors to match your brand globally
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground selection:bg-primary/20 selection:text-primary">
            <Sidebar />

            {/* min-w-0 prevents flexbox children from overflowing their container horizontally */}
            <div className="flex flex-col flex-1 min-w-0 relative overflow-hidden">

                {/* Subtle ambient lighting effect at the top of the app shell */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/5 blur-[120px] pointer-events-none rounded-full z-0" />

                <Header />

                {/* Main scrollable area */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 scroll-smooth custom-scrollbar">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1] // Premium, native-feeling deceleration curve
                        }}
                        className="min-h-full flex flex-col"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}