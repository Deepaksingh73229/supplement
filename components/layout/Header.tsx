'use client';

import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Key, Shield, Sparkles, Lock, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useGeminiKey } from '@/hooks/useGeminiKey';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export function Header() {
    const { apiKey, setApiKey, isConfigured } = useGeminiKey();

    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-muted/50 bg-background/70 backdrop-blur-xl px-4 sm:px-6 transition-all duration-200">

            {/* Brand & Title */}
            <div className="flex items-center gap-3 sm:gap-4">
                <div className="hidden sm:flex h-8 w-8 rounded-lg bg-primary/10 items-center justify-center border border-primary/20">
                    <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Supplement Review System
                </h1>
                <Badge
                    variant="secondary"
                    className="hidden sm:flex bg-primary/10 text-primary border-primary/20 rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold shadow-sm"
                >
                    AI-Powered
                </Badge>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className={`h-9 rounded-full px-4 gap-2 transition-all duration-300 ${isConfigured
                                ? 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-600'
                                : 'border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary shadow-sm'
                                }`}
                        >
                            {isConfigured ? (
                                <>
                                    <Shield className="h-4 w-4" />
                                    <span className="hidden sm:inline font-medium">API Connected</span>
                                </>
                            ) : (
                                <>
                                    <Key className="h-4 w-4" />
                                    <span className="hidden sm:inline font-medium">Set API Key</span>
                                    <span className="sm:hidden font-medium">Setup</span>
                                </>
                            )}
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md rounded-2xl border-muted/60 shadow-xl overflow-hidden p-0">
                        {/* Decorative Top Bar */}
                        <div className={`h-1.5 w-full ${isConfigured ? 'bg-emerald-500' : 'bg-primary'}`} />

                        <div className="p-6">
                            <DialogHeader className="mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-xl ${isConfigured ? 'bg-emerald-500/10' : 'bg-primary/10'}`}>
                                        {isConfigured ? <Shield className="h-5 w-5 text-emerald-500" /> : <Key className="h-5 w-5 text-primary" />}
                                    </div>
                                    <DialogTitle className="text-xl">Gemini API Configuration</DialogTitle>
                                </div>
                                <DialogDescription className="text-muted-foreground leading-relaxed">
                                    Enter your Google Gemini API key to enable AI formulation analysis and semantic search capabilities.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Security Trust Indicator */}
                                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-secondary/40 border border-secondary">
                                    <Lock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-foreground">Local Storage Secure</p>
                                        <p className="text-xs text-muted-foreground">
                                            Your key is encrypted and stored locally in your browser. It is never transmitted to our servers.
                                        </p>
                                    </div>
                                </div>

                                {/* Input Field */}
                                <div className="space-y-2.5">
                                    <Label htmlFor="api-key" className="text-sm font-medium flex items-center justify-between">
                                        <span>Authentication Key</span>
                                        {isConfigured && (
                                            <span className="text-xs text-emerald-500 flex items-center gap-1 font-medium">
                                                <CheckCircle2 className="h-3 w-3" /> Saved
                                            </span>
                                        )}
                                    </Label>
                                    <div className="relative group">
                                        <Input
                                            id="api-key"
                                            type="password"
                                            placeholder="AIzaSy..."
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            className="pr-10 h-11 font-mono text-sm transition-all focus-visible:ring-primary/30"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary/50 transition-colors pointer-events-none">
                                            <Key className="h-4 w-4" />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-1">
                                        <a
                                            href="https://aistudio.google.com/app/apikey"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 font-medium"
                                        >
                                            Get your key from Google AI Studio <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="h-8 w-px bg-border mx-1" /> {/* Subtle Separator */}

                <ThemeToggle />
            </div>
        </header>
    );
}