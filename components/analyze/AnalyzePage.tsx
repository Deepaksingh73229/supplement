"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
    Microscope,
    Loader2,
    AlertCircle,
    FlaskConical,
    Sparkles,
    FileText,
    Tag,
    MessageSquare,
    Beaker,
    Zap,
    ShieldCheck,
    ArrowRight,
    Dna,
    Atom,
    Pill,
    ScanLine,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useGeminiKey } from "@/hooks/useGeminiKey";
import { toast } from "@/hooks/use-toast";
import { AnalysisResultView } from "./AnalysisResultView";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { ProductInput } from "@/types";
import { cn } from "@/lib/utils";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.05 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export function AnalyzePage() {
    const { analyze, reset, isLoading, error, result } = useAnalysis();
    const { apiKey, isConfigured } = useGeminiKey();
    const [formData, setFormData] = useState<ProductInput>({
        productName: "",
        category: "",
        ingredientsText: "",
        marketingClaims: "",
    });

    const filledFields = [
        formData.productName,
        formData.category,
        formData.ingredientsText,
    ].filter(Boolean).length;
    const progress = Math.min((filledFields / 3) * 100, 100);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConfigured) {
            toast({
                title: "API Key Required",
                description: "Please set your Gemini API key in settings first.",
                variant: "destructive",
            });
            return;
        }
        if (!formData.productName.trim() || !formData.ingredientsText.trim()) {
            toast({
                title: "Missing Information",
                description: "Product name and ingredients are required.",
                variant: "destructive",
            });
            return;
        }
        try {
            await analyze(formData, apiKey);
            toast({
                title: "Analysis Complete",
                description: "Your formulation has been successfully analyzed.",
                variant: "success",
            });
        } catch (err: any) {
            toast({ title: "Analysis Failed", description: err.message, variant: "destructive" });
        }
    };

    const handleReset = () => {
        reset();
        setFormData({ productName: "", category: "", ingredientsText: "", marketingClaims: "" });
    };

    const loadDemo = () =>
        setFormData({
            productName: "SleepWell Pro Advanced",
            category: "Sleep Support",
            ingredientsText: `Melatonin - 5mg
Magnesium Glycinate - 400mg
L-Theanine - 200mg
Valerian Root Extract (0.8% Valerenic Acid) - 300mg
5-HTP (5-Hydroxytryptophan) - 100mg
GABA (Gamma-Aminobutyric Acid) - 750mg
Passionflower Extract - 100mg
Hops Extract - 150mg`,
            marketingClaims: `"Clinically proven to induce deep sleep within 30 minutes"
"Non-habit forming sleep aid"
"100% natural formula with zero side effects"
"Doctor recommended sleep solution"`,
        });

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            {/* ═══ Modern Background ═══ */}
            <div className="pointer-events-none fixed inset-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[700px] w-[900px] rounded-full bg-blue-500/[0.04] blur-[150px]" />
                <div className="absolute bottom-0 right-0 h-[500px] w-[600px] rounded-full bg-emerald-500/[0.03] blur-[130px]" />
                <div className="absolute top-1/3 left-0 h-[400px] w-[400px] rounded-full bg-violet-500/[0.03] blur-[120px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-5xl px-6 py-8">
                <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div
                            key="form"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, y: -16, transition: { duration: 0.25 } }}
                        >
                            {/* ═══ Modern Header ═══ */}
                            <motion.div variants={itemVariants} className="mb-8">
                                <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-lg animate-pulse" />
                                        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25">
                                            <ScanLine className="h-7 w-7" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                                Analyze Formulation
                                            </h1>
                                            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20 gap-1">
                                                <Sparkles className="h-3 w-3" />
                                                AI-Powered
                                            </Badge>
                                        </div>
                                        <p className="mt-1.5 max-w-xl text-sm text-muted-foreground leading-relaxed">
                                            Submit your supplement formulation for comprehensive safety review,
                                            interaction analysis, and marketing claim verification.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* ═══ Progress Bar ═══ */}
                            <motion.div variants={itemVariants} className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                                        Form Completion
                                    </span>
                                    <span className="text-sm font-bold text-blue-600">{Math.round(progress)}%</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-muted/80">
                                    <motion.div
                                        className="h-full rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                </div>
                            </motion.div>

                            {/* ═══ Main Card ═══ */}
                            <motion.div variants={itemVariants}>
                                <Card className="overflow-hidden border border-border/60 bg-white dark:bg-card shadow-lg shadow-black/[0.02]">
                                    <CardContent className="p-0">
                                        {/* Card Header */}
                                        <div className="border-b border-border/50 px-8 py-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                                                        <FlaskConical className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-lg font-semibold text-foreground">
                                                            Product Information
                                                        </h2>
                                                        <p className="text-xs text-muted-foreground">
                                                            Enter your supplement details for AI analysis
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="text-xs text-muted-foreground border-border/60">
                                                    {formData.ingredientsText.split("\n").filter(Boolean).length || 0} ingredients
                                                </Badge>
                                            </div>
                                        </div>

                                        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
                                            {/* Row 1: Product + Category */}
                                            <div className="grid gap-5 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="productName" className="text-sm font-semibold flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-blue-500" />
                                                        Product Name
                                                        <span className="text-red-500 text-xs">*</span>
                                                    </Label>
                                                    <Input
                                                        id="productName"
                                                        placeholder="e.g., SleepWell Pro Capsules"
                                                        value={formData.productName}
                                                        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                                        className="h-11 rounded-lg border-border/60 bg-muted/30 focus:bg-white dark:focus:bg-background focus:border-blue-500/50 transition-all"
                                                        required
                                                    />
                                                    <p className="text-xs text-muted-foreground">Commercial name of your supplement product</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="category" className="text-sm font-semibold flex items-center gap-2">
                                                        <Tag className="h-4 w-4 text-emerald-500" />
                                                        Category
                                                        <span className="text-red-500 text-xs">*</span>
                                                    </Label>
                                                    <Select
                                                        value={formData.category}
                                                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                                                    >
                                                        <SelectTrigger className="h-11 rounded-lg border-border/60 bg-muted/30 focus:bg-white dark:focus:bg-background focus:border-emerald-500/50 transition-all">
                                                            <SelectValue placeholder="Select category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {PRODUCT_CATEGORIES.map((cat) => (
                                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <p className="text-xs text-muted-foreground">Determines analysis focus area</p>
                                                </div>
                                            </div>

                                            {/* Row 2: Ingredients */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="ingredients" className="text-sm font-semibold flex items-center gap-2">
                                                        <Beaker className="h-4 w-4 text-violet-500" />
                                                        Ingredient List with Dosages
                                                        <span className="text-red-500 text-xs">*</span>
                                                    </Label>
                                                    {formData.ingredientsText && (
                                                        <Badge variant="secondary" className="text-[10px]">
                                                            {formData.ingredientsText.split("\n").filter(Boolean).length} ingredients
                                                        </Badge>
                                                    )}
                                                </div>
                                                <Textarea
                                                    id="ingredients"
                                                    placeholder={`Melatonin - 5mg
Magnesium Glycinate - 400mg
L-Theanine - 200mg
Valerian Root Extract - 300mg`}
                                                    value={formData.ingredientsText}
                                                    onChange={(e) => setFormData({ ...formData, ingredientsText: e.target.value })}
                                                    className="min-h-[180px] rounded-lg border-border/60 bg-muted/30 font-mono text-sm leading-7 focus:bg-white dark:focus:bg-background focus:border-violet-500/50 transition-all resize-y"
                                                    required
                                                />
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-muted-foreground">Format: Ingredient Name - Dosage (one per line)</p>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                                                        <ShieldCheck className="h-3 w-3" />
                                                        End-to-end encrypted
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Row 3: Claims */}
                                            <div className="space-y-2">
                                                <Label htmlFor="claims" className="text-sm font-semibold flex items-center gap-2">
                                                    <MessageSquare className="h-4 w-4 text-amber-500" />
                                                    Marketing Claims
                                                    <Badge variant="secondary" className="text-[10px] font-normal ml-1">Optional</Badge>
                                                </Label>
                                                <Textarea
                                                    id="claims"
                                                    placeholder={`"Clinically proven to induce deep sleep within 30 minutes"
"Non-habit forming sleep aid"
"100% natural formula with zero side effects"`}
                                                    value={formData.marketingClaims}
                                                    onChange={(e) => setFormData({ ...formData, marketingClaims: e.target.value })}
                                                    className="min-h-[120px] rounded-lg border-border/60 bg-muted/30 text-sm leading-7 focus:bg-white dark:focus:bg-background focus:border-amber-500/50 transition-all resize-y"
                                                />
                                                <p className="text-xs text-muted-foreground">AI flags problematic claims against FDA/FTC standards</p>
                                            </div>

                                            {/* Error */}
                                            <AnimatePresence>
                                                {error && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30 p-4">
                                                            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="text-sm font-semibold text-red-700 dark:text-red-400">Analysis failed</p>
                                                                <p className="text-sm text-red-600/80 dark:text-red-400/70">{error}</p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Actions */}
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={loadDemo}
                                                        className="gap-2 text-xs border-border/60 hover:bg-muted"
                                                    >
                                                        <Zap className="h-3.5 w-3.5" />
                                                        Load Demo
                                                    </Button>
                                                    {!isConfigured && (
                                                        <Badge variant="destructive" className="gap-1.5 text-xs">
                                                            <AlertCircle className="h-3 w-3" />
                                                            API Key Required
                                                        </Badge>
                                                    )}
                                                </div>

                                                <Button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    size="lg"
                                                    className={cn(
                                                        "gap-2 rounded-lg px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 transition-all",
                                                        "disabled:opacity-70"
                                                    )}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                            Analyzing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Microscope className="h-4 w-4" />
                                                            Analyze Formulation
                                                            <ArrowRight className="h-4 w-4" />
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Trust Bar */}
                            <motion.div
                                variants={itemVariants}
                                className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground/50"
                            >
                                <div className="flex items-center gap-1.5">
                                    <Dna className="h-3.5 w-3.5" />
                                    Gemini 2.5 Pro
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Atom className="h-3.5 w-3.5" />
                                    Molecular Analysis
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Pill className="h-3.5 w-3.5" />
                                    50K+ Ingredients Database
                                </div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <AnalysisResultView result={result} onReset={handleReset} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}