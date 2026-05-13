'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings, Key, Shield, Info, ExternalLink, Trash2, CheckCircle2,
    Lock, AlertCircle, Code2, Database, Layout, Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useGeminiKey } from '@/hooks/useGeminiKey';
import { toast } from '@/hooks/use-toast';

export function SettingsPage() {
    const { apiKey, setApiKey, clearApiKey, isConfigured, isSystemConfigured } = useGeminiKey();
    const [showKey, setShowKey] = useState(false);
    const [localKey, setLocalKey] = useState(apiKey);

    useEffect(() => {
        setLocalKey(apiKey);
    }, [apiKey]);

    const isActuallyConfigured = isConfigured || isSystemConfigured;

    const handleSave = () => {
        setApiKey(localKey);
        toast({
            title: 'Settings Saved',
            description: 'Your API key has been securely updated.',
            variant: 'default',
        });
    };

    const handleClear = () => {
        clearApiKey();
        setLocalKey('');
        toast({
            title: 'API Key Cleared',
            description: 'Your API key has been removed from local storage.',
            variant: 'default',
        });
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-background to-muted/20 p-6">
            <div className="max-w-5xl mx-auto pt-8 space-y-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="border-b pb-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 ring-1 ring-primary/20 shadow-inner flex items-center justify-center">
                            <Settings className="h-7 w-7 text-primary" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Preferences</h1>
                            <p className="text-muted-foreground mt-1">
                                Manage your system configuration and API connections
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div className="space-y-6">
                    {/* API Key Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                    >
                        <Card className={`overflow-hidden transition-colors duration-300 ${isActuallyConfigured ? 'border-emerald-500/20 shadow-sm' : 'border-primary/20 shadow-md'}`}>
                            <CardContent className="p-0">
                                {/* Card Header Area */}
                                <div className="px-6 py-2.5  border-b bg-muted/10">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2.5 rounded-xl ${isActuallyConfigured ? 'bg-emerald-500/10 text-emerald-600' : 'bg-primary/10 text-primary'}`}>
                                                <Key className="h-5 w-5" />
                                            </div>
                                            
                                            <div>
                                                <h2 className="text-xl font-bold tracking-tight">Gemini API Key</h2>
                                                <p className="text-sm text-muted-foreground">Required for AI analysis and search</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {isSystemConfigured && !isConfigured && (
                                                <Badge variant="outline" className="border-blue-500/30 text-blue-600 bg-blue-500/5 gap-1.5">
                                                    System Default Active
                                                </Badge>
                                            )}
                                            <Badge
                                                variant={isActuallyConfigured ? 'outline' : 'secondary'}
                                                className={`gap-1.5 px-3 py-1 text-sm ${isActuallyConfigured
                                                        ? 'border-emerald-500/30 text-emerald-600 bg-emerald-500/5'
                                                        : 'bg-primary/10 text-primary'
                                                    }`}
                                            >
                                                {isActuallyConfigured ? (
                                                    <>
                                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                                        Connected
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle className="h-3.5 w-3.5" />
                                                        Configuration Required
                                                    </>
                                                )}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body Area */}
                                <div className="px-6 py-3 flex flex-col gap-3">
                                    {/* Security Notice */}
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30 border border-secondary">
                                        <Shield className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Authentication Options</p>

                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                {isSystemConfigured 
                                                    ? 'A system-level API key is provided, but you can override it with your own personal key below. Personal keys are stored only in your browser.'
                                                    : 'Your API key is never stored on our servers. It is kept securely in your browser\'s local storage and is only transmitted directly to Google\'s API during execution.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="api-key" className="text-sm font-bold">
                                            Authentication Key
                                        </Label>

                                        <div className="relative flex items-center group">
                                            <div className="absolute left-3 text-muted-foreground/70 pointer-events-none">
                                                <Lock className="h-4 w-4" />
                                            </div>

                                            <Input
                                                id="api-key"
                                                type={showKey ? 'text' : 'password'}
                                                placeholder="AIzaSy..."
                                                value={localKey}
                                                onChange={(e) => setLocalKey(e.target.value)}
                                                className="pl-10 pr-24 h-10 font-mono text-sm transition-all focus-visible:ring-primary/30"
                                            />

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowKey(!showKey)}
                                                type="button"
                                                className="absolute right-1.5 h-9 text-xs font-medium text-muted-foreground hover:text-foreground"
                                            >
                                                {showKey ? 'Hide' : 'Reveal'}
                                            </Button>
                                        </div>
                                        <div className="flex justify-end">
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

                                    <Separator />

                                    <div className="flex items-center gap-3">
                                        <Button
                                            onClick={handleSave}
                                            className="gap-2 h-10 px-4 shadow-sm hover:shadow transition-all"
                                            disabled={!localKey.trim()}
                                        >
                                            <CheckCircle2 className="h-4 w-4 cursor-pointer" />
                                            Save Configuration
                                        </Button>

                                        <AnimatePresence>
                                            {isConfigured && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        onClick={handleClear}
                                                        className="gap-2 h-10 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Remove Key
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* About Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        <Card className="border-muted/60  bg-background/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-secondary/50">
                                        <Info className="h-5 w-5 text-foreground" />
                                    </div>

                                    <h3 className="text-xl font-semibold tracking-tight">System Information</h3>
                                </div>

                                <p className="text-muted-foreground leading-relaxed mb-8">
                                    An AI-powered platform for nutraceutical formulation analysis,
                                    regulatory compliance checking, and semantic ingredient search.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-4 p-4 rounded-xl border bg-card/50">
                                        <Code2 className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Framework</p>
                                            <p className="font-medium">Next.js 16 <span className="text-muted-foreground font-normal">(App Router)</span></p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-xl border bg-card/50">
                                        <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">AI Engine</p>
                                            <p className="font-medium">Gemini 2.5 Flash</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-xl border bg-card/50">
                                        <Database className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Embeddings</p>
                                            <p className="font-medium">Gemini Embedding-2</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-xl border bg-card/50">
                                        <Layout className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Interface</p>
                                            <p className="font-medium">Tailwind CSS + Radix UI</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}