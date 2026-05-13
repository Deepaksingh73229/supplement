import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, FlaskConical, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
            {/* ─── Decorative background elements ─── */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
            </div>

            {/* ─── Subtle grid pattern ─── */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                }}
            />

            {/* ─── Content Card ─── */}
            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Icon with gradient ring */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 blur-xl" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/20">
                        <FlaskConical className="h-10 w-10 text-primary" />
                    </div>
                </div>

                {/* 404 Code */}
                <h1 className="text-8xl font-bold tracking-tighter text-foreground/10 select-none sm:text-9xl">
                    404
                </h1>

                {/* Message */}
                <div className="-mt-10 mb-2">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        Page not found
                    </h2>
                </div>

                <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    The page you are looking for might have been removed, had its name
                    changed, or is temporarily unavailable.
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Link href="/">
                        <Button
                            size="lg"
                            className="gap-2 rounded-xl bg-primary px-6 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:brightness-110"
                        >
                            <Home className="h-4 w-4" />
                            Return to Dashboard
                        </Button>
                    </Link>

                    <Link href="/search">
                        <Button
                            variant="outline"
                            size="lg"
                            className="gap-2 rounded-xl border-border/60 px-6 text-muted-foreground hover:bg-accent hover:text-foreground"
                        >
                            <Search className="h-4 w-4" />
                            Semantic Search
                        </Button>
                    </Link>
                </div>
            </div>

            {/* ─── Bottom hint ─── */}
            <div className="absolute bottom-8 text-xs text-muted-foreground/50">
                NutraReview — AI-powered nutraceutical analysis
            </div>
        </div>
    );
}