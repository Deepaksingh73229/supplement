"use client";

import { motion } from "framer-motion";
import { FlaskConical } from "lucide-react";

export default function Loading() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
            {/* ─── Ambient glow ─── */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
            </div>

            {/* ─── Subtle dot grid ─── */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
                    backgroundSize: "32px 32px",
                }}
            />

            {/* ─── Loader content ─── */}
            <div className="relative z-10 flex flex-col items-center gap-6">
                {/* Branded icon with liquid-pulse effect */}
                <div className="relative">
                    {/* Outer pulse rings */}
                    <motion.div
                        className="absolute inset-0 rounded-2xl bg-primary/20"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute inset-0 rounded-2xl bg-primary/10"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    />

                    {/* Icon container */}
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-primary/20 backdrop-blur-sm">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <FlaskConical className="h-8 w-8 text-primary" />
                        </motion.div>
                    </div>
                </div>

                {/* Text block */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <motion.h2
                        className="text-lg font-semibold tracking-tight text-foreground"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        Loading
                    </motion.h2>

                    <motion.p
                        className="text-sm text-muted-foreground"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.4 }}
                    >
                        Preparing your workspace...
                    </motion.p>
                </div>

                {/* Progress shimmer bar */}
                <div className="relative h-1 w-48 overflow-hidden rounded-full bg-muted">
                    <motion.div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary/40 via-primary to-primary/40"
                        initial={{ width: "0%", x: "-100%" }}
                        animate={{ width: "60%", x: ["0%", "100%", "0%"] }}
                        transition={{
                            width: { duration: 1.5, ease: "easeOut" },
                            x: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}