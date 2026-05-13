'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, FlaskConical, Clock, ArrowRight, AlertTriangle, CheckCircle2, Activity, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnalysisResult } from '@/types';
import { getHistory } from '@/hooks/useAnalysis';
import { formatDate, riskBadgeColor, scoreColor } from '@/lib/utils';
import Link from 'next/link';

export function HistoryPage() {
    const [history, setHistory] = useState<AnalysisResult[]>([]);

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    const clearHistory = () => {
        localStorage.removeItem('analysis-history');
        setHistory([]);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/20 p-6">
            <div className="max-w-5xl mx-auto pt-4">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="mb-10"
                >
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-6">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-primary/10 ring-1 ring-primary/20 shadow-inner flex items-center justify-center">
                                <History className="h-7 w-7 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Analysis History</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {history.length} {history.length === 1 ? 'analysis' : 'analyses'} stored locally
                                    </p>
                                </div>
                            </div>
                        </div>

                        {history.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearHistory}
                                className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors self-start sm:self-auto"
                            >
                                <Trash2 className="h-4 w-4" />
                                Clear History
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* Content Section */}
                <AnimatePresence mode="wait">
                    {history.length === 0 ? (
                        <motion.div
                            key="empty-state"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center py-24 px-4 bg-background/50 rounded-3xl border border-dashed border-muted-foreground/20 backdrop-blur-sm"
                        >
                            <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-6 ring-1 ring-primary/10">
                                <History className="h-10 w-10 text-primary/40" />
                            </div>
                            <h3 className="text-2xl font-bold tracking-tight mb-3">No analyses yet</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto mb-8 leading-relaxed">
                                Your past supplement evaluations will appear here. Start by analyzing your first formulation to generate insights.
                            </p>
                            <Link href="/analyze">
                                <Button size="lg" className="gap-2 rounded-full px-8 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                                    <FlaskConical className="h-5 w-5" />
                                    Start New Analysis
                                </Button>
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div key="history-list" className="relative">
                            {/* Optional: Add a subtle fade at the bottom of the scroll area */}
                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

                            <ScrollArea className="h-[calc(100vh-240px)] pr-4 pb-12">
                                <div className="space-y-4">
                                    {history.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05, duration: 0.3 }}
                                        >
                                            <Card className="group overflow-hidden border-muted/60 hover:border-primary/30 hover:shadow-md transition-all duration-300 bg-background">
                                                <CardContent className="p-0">
                                                    <div className="flex flex-col md:flex-row items-stretch">

                                                        {/* Left Content: Identity & Meta */}
                                                        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                                                            <div className="flex items-start gap-4">
                                                                <div className="h-12 w-12 shrink-0 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary/10 transition-colors">
                                                                    <FlaskConical className="h-6 w-6 text-primary/70" />
                                                                </div>
                                                                <div className="space-y-1.5">
                                                                    <h4 className="font-bold text-lg leading-none tracking-tight group-hover:text-primary transition-colors">
                                                                        {item.productName}
                                                                    </h4>
                                                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                                                        <Badge variant="secondary" className="text-xs font-medium bg-secondary/50">
                                                                            {item.category}
                                                                        </Badge>
                                                                        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-md">
                                                                            <FlaskConical className="h-3 w-3" />
                                                                            {item.ingredients.length} ingredients
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground/80 pl-16">
                                                                <Clock className="h-3.5 w-3.5" />
                                                                Analyzed on {formatDate(item.createdAt)}
                                                            </div>
                                                        </div>

                                                        {/* Right Content: Metrics & Score */}
                                                        <div className="bg-muted/10 md:w-72 p-5 md:p-6 border-t md:border-t-0 md:border-l border-muted/40 flex flex-col justify-center relative overflow-hidden">
                                                            {/* Subtle decorative background for score area */}
                                                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/20 opacity-50 pointer-events-none" />

                                                            <div className="relative z-10 flex items-center justify-between h-full">
                                                                <div className="space-y-3">
                                                                    <Badge className={`${riskBadgeColor(item.overallRisk)} shadow-sm uppercase tracking-wider text-[10px] px-2 py-0.5`}>
                                                                        {item.overallRisk} Risk
                                                                    </Badge>

                                                                    <div className="space-y-1.5">
                                                                        <div className="flex items-center gap-2 text-sm font-medium">
                                                                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                                                            <span className="text-muted-foreground">
                                                                                <strong className="text-foreground">{item.observations.filter(o => o.type === 'positive').length}</strong> positive
                                                                            </span>
                                                                        </div>
                                                                        
                                                                        <div className="flex items-center gap-2 text-sm font-medium">
                                                                            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                                                                            <span className="text-muted-foreground">
                                                                                <strong className="text-foreground">{item.claims.filter(c => c.isProblematic).length}</strong> claim issues
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="text-right flex flex-col items-end justify-center">
                                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Score</span>
                                                                    <p className={`text-4xl font-black tracking-tighter ${scoreColor(item.overallScore)}`}>
                                                                        {item.overallScore}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Hover Action Indicator (Visual only, implying clickability if you add routing later) */}
                                                        <div className="hidden md:flex w-12 bg-muted/5 items-center justify-center border-l border-muted/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}