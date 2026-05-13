import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

export function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
        throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let aMagnitude = 0;
    let bMagnitude = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        aMagnitude += a[i] * a[i];
        bMagnitude += b[i] * b[i];
    }
    
    if (aMagnitude === 0 || bMagnitude === 0) return 0;
    return dotProduct / (Math.sqrt(aMagnitude) * Math.sqrt(bMagnitude));
}

export function riskColor(level: string): string {
    switch (level) {
        case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-800';
        case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/30 dark:border-amber-800';
        case 'high': return 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-950/30 dark:border-orange-800';
        case 'critical': return 'text-rose-600 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-950/30 dark:border-rose-800';
        default: return 'text-slate-600 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-950/30 dark:border-slate-800';
    }
}

export function riskBadgeColor(level: string): string {
    switch (level) {
        case 'low': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
        case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
        case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300';
        case 'critical': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300';
        default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-300';
    }
}

export function scoreColor(score: number): string {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-rose-600 dark:text-rose-400';
}

export function scoreRingColor(score: number): string {
    if (score >= 80) return 'stroke-emerald-500 dark:stroke-emerald-400';
    if (score >= 60) return 'stroke-amber-500 dark:stroke-amber-400';
    if (score >= 40) return 'stroke-orange-500 dark:stroke-orange-400';
    return 'stroke-rose-500 dark:stroke-rose-400';
}
