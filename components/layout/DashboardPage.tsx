'use client';

import { AnimatePresence, motion, Variants } from 'framer-motion';
import {
    FlaskConical,
    Microscope,
    Search,
    Shield,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    Clock,
    BarChart3,
    ChevronRight,
    Activity
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { getHistory } from '@/hooks/useAnalysis';
import { useEffect, useState } from 'react';
import { AnalysisResult } from '@/types';
import { formatDate, riskBadgeColor, scoreColor } from '@/lib/utils';

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08, ease: 'easeOut' }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function DashboardPage() {
    const [history, setHistory] = useState<AnalysisResult[]>([]);

    useEffect(() => {
        setHistory(getHistory().slice(0, 5));
    }, []);

    const stats = {
        total: history.length,
        lowRisk: history.filter(h => h.overallRisk === 'low').length,
        highRisk: history.filter(h => h.overallRisk === 'high' || h.overallRisk === 'critical').length,
        avgScore: history.length > 0
            ? Math.round(history.reduce((acc, h) => acc + h.overallScore, 0) / history.length)
            : 0,
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/20 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Hero Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6"
                >
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                            <Activity className="h-4 w-4" />
                            <span>System Active</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                            Dashboard
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                            AI-powered nutraceutical formulation analysis and review platform.
                        </p>
                    </div>

                    <div className="hidden md:flex">
                        <Link href="/analyze">
                            <Button size="lg" className="rounded-full shadow-sm hover:shadow-md transition-all gap-2">
                                <Microscope className="h-4 w-4" />
                                New Analysis
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
                >
                    {/* Total Analyses */}
                    <motion.div variants={item}>
                        <Card className="relative overflow-hidden border-muted/60 hover:border-primary/30 transition-colors bg-background shadow-sm">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <BarChart3 className="h-24 w-24 -mr-6 -mt-6" />
                            </div>

                            <CardContent className="p-6 relative z-10">
                                <div className="flex flex-col gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                                        <BarChart3 className="h-5 w-5 text-primary" />
                                    </div>
                                    
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Total Analyses</p>
                                        <p className="text-4xl font-bold tracking-tight text-foreground">{stats.total}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Low Risk */}
                    <motion.div variants={item}>
                        <Card className="relative overflow-hidden border-muted/60 hover:border-emerald-500/30 transition-colors bg-background shadow-sm">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                                <CheckCircle2 className="h-24 w-24 -mr-6 -mt-6 text-emerald-600" />
                            </div>
                            <CardContent className="p-6 relative z-10">
                                <div className="flex flex-col gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-500/20">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Low Risk Formulations</p>
                                        <p className="text-4xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{stats.lowRisk}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* High Risk */}
                    <motion.div variants={item}>
                        <Card className="relative overflow-hidden border-muted/60 hover:border-rose-500/30 transition-colors bg-background shadow-sm">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                                <AlertTriangle className="h-24 w-24 -mr-6 -mt-6 text-rose-600" />
                            </div>
                            <CardContent className="p-6 relative z-10">
                                <div className="flex flex-col gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center ring-1 ring-rose-500/20">
                                        <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">High Risk Alerts</p>
                                        <p className="text-4xl font-bold tracking-tight text-rose-600 dark:text-rose-400">{stats.highRisk}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Avg Score */}
                    <motion.div variants={item}>
                        <Card className="relative overflow-hidden border-muted/60 hover:border-amber-500/30 transition-colors bg-background shadow-sm">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                                <TrendingUp className="h-24 w-24 -mr-6 -mt-6 text-amber-600" />
                            </div>
                            <CardContent className="p-6 relative z-10">
                                <div className="flex flex-col gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center ring-1 ring-amber-500/20">
                                        <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Average Health Score</p>
                                        <p className={`text-4xl font-bold tracking-tight ${scoreColor(stats.avgScore)}`}>
                                            {stats.avgScore}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Quick Actions (Bento Box Style) */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold tracking-tight px-1">Quick Tools</h2>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-3 gap-5"
                    >
                        <Link href="/analyze">
                            <Card className="group relative h-full overflow-hidden border-muted/60 hover:border-primary/40 hover:shadow-lg transition-all duration-300 bg-background/50 backdrop-blur-sm cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <CardContent className="p-6 flex flex-col h-full relative z-10">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ease-out">
                                        <Microscope className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-bold text-lg tracking-tight mb-2">Analyze Formulation</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                                        Review ingredients, dosages, and marketing claims against databases using AI.
                                    </p>
                                    <div className="flex items-center text-primary text-sm font-semibold mt-6 group-hover:translate-x-1 transition-transform">
                                        Start Analysis <ChevronRight className="h-4 w-4 ml-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/search">
                            <Card className="group relative h-full overflow-hidden border-muted/60 hover:border-primary/40 hover:shadow-lg transition-all duration-300 bg-background/50 backdrop-blur-sm cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <CardContent className="p-6 flex flex-col h-full relative z-10">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ease-out">
                                        <Search className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-bold text-lg tracking-tight mb-2">Semantic Search</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                                        Find ingredients by natural language queries and intent using embeddings.
                                    </p>
                                    <div className="flex items-center text-primary text-sm font-semibold mt-6 group-hover:translate-x-1 transition-transform">
                                        Search DB <ChevronRight className="h-4 w-4 ml-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/settings">
                            <Card className="group relative h-full overflow-hidden border-muted/60 hover:border-primary/40 hover:shadow-lg transition-all duration-300 bg-background/50 backdrop-blur-sm cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <CardContent className="p-6 flex flex-col h-full relative z-10">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ease-out">
                                        <Shield className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-bold text-lg tracking-tight mb-2">Configure API</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                                        Manage your Gemini API key securely and adjust system-wide preferences.
                                    </p>
                                    <div className="flex items-center text-primary text-sm font-semibold mt-6 group-hover:translate-x-1 transition-transform">
                                        System Settings <ChevronRight className="h-4 w-4 ml-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                </div>

                {/* Recent History */}
                <AnimatePresence>
                    {history.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-lg font-semibold tracking-tight">Recent Analyses</h2>
                                <Link href="/history">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5 rounded-full px-4">
                                        View All <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>

                            <div className="grid gap-3">
                                {history.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                    >
                                        <Card className="group hover:border-primary/30 hover:shadow-md transition-all duration-200 overflow-hidden bg-background">
                                            <CardContent className="p-0">
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 gap-4">

                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 shrink-0 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                            <FlaskConical className="h-5 w-5 text-primary/70" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-base leading-tight group-hover:text-primary transition-colors">
                                                                {item.productName}
                                                            </h4>
                                                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                                                <Badge variant="secondary" className="text-[10px] uppercase tracking-wider bg-secondary/50">
                                                                    {item.category}
                                                                </Badge>
                                                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                                                    <Clock className="h-3 w-3" />
                                                                    {formatDate(item.createdAt)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4 w-full sm:w-auto sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                                                        <Badge className={`${riskBadgeColor(item.overallRisk)} shadow-sm text-xs px-2.5 py-0.5 uppercase tracking-wide`}>
                                                            {item.overallRisk} Risk
                                                        </Badge>
                                                        <div className="flex items-baseline gap-1 bg-muted/30 px-3 py-1 rounded-lg border">
                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Score</span>
                                                            <span className={`text-xl font-black ${scoreColor(item.overallScore)}`}>
                                                                {item.overallScore}
                                                            </span>
                                                        </div>
                                                    </div>

                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}