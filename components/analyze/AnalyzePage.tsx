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
    ChevronRight,
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
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function AnalyzePage() {
    const { analyze, reset, isLoading, error, result } = useAnalysis();
    const { apiKey, isConfigured } = useGeminiKey();
    const [focusedField, setFocusedField] = useState<string | null>(null);
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
            {/* ═══ Cinematic Background ═══ */}
            <div className="pointer-events-none fixed inset-0">
                <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/[0.03] blur-[140px]" />
                <div className="absolute top-1/3 -left-60 h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-[120px]" />
                <div className="absolute -bottom-40 right-1/4 h-[600px] w-[600px] rounded-full bg-primary/[0.025] blur-[140px]" />
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
                        backgroundSize: "28px 28px",
                    }}
                />
            </div>

            <div className="relative z-10 mx-auto max-w-5xl px-6 py-10">
                <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div
                            key="form"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                        >
                            {/* ═══ Hero Header ═══ */}
                            <motion.div variants={itemVariants} className="mb-10 text-center sm:text-left">
                                <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                                    <div className="relative shrink-0">
                                        <motion.div
                                            className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl"
                                            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.2, 0.4] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent ring-1 ring-primary/20 backdrop-blur-sm">
                                            <Microscope className="h-7 w-7 text-primary" />
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                            Analyze{" "}
                                            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                                Formulation
                                            </span>
                                        </h1>
                                        <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                                            Submit your supplement formulation for a comprehensive AI-powered safety
                                            review, interaction analysis, and marketing claim verification.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* ═══ Progress Pill ═══ */}
                            <motion.div variants={itemVariants} className="mb-8">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Form Completion
                                    </span>
                                    <span className="text-xs font-semibold text-primary">{Math.round(progress)}%</span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                    <motion.div
                                        className="h-full rounded-full bg-gradient-to-r from-primary/60 via-primary to-primary/60"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                </div>
                            </motion.div>

                            {/* ═══ Main Form Card ═══ */}
                            <motion.div variants={itemVariants}>
                                <Card className="overflow-hidden border-0 bg-card/60 shadow-2xl shadow-primary/[0.03] ring-1 ring-border/40 backdrop-blur-xl">
                                    {/* Animated top gradient line */}
                                    <div className="relative h-1 w-full overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                                        <motion.div
                                            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                            animate={{ x: ["-100%", "400%"] }}
                                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                    </div>

                                    <CardContent className="p-8">
                                        <div className="mb-8 flex items-center justify-between">
                                            <div>
                                                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                                                    Product Information
                                                </h2>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Enter your supplement details below
                                                </p>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="hidden gap-1.5 border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary sm:flex"
                                            >
                                                <Sparkles className="h-3 w-3" />
                                                AI-Powered
                                            </Badge>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-8">
                                            {/* ═══ Row 1: Name + Category ═══ */}
                                            <div className="grid gap-6 sm:grid-cols-2">
                                                <motion.div
                                                    className={cn(
                                                        "group space-y-2.5 rounded-xl border p-4 transition-all duration-300",
                                                        focusedField === "productName"
                                                            ? "border-primary/30 bg-primary/[0.02] shadow-sm shadow-primary/5"
                                                            : "border-border/40 bg-transparent hover:border-border/80"
                                                    )}
                                                >
                                                    <Label
                                                        htmlFor="productName"
                                                        className="flex items-center gap-2 text-sm font-semibold"
                                                    >
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                                                            <FileText className="h-3.5 w-3.5 text-primary" />
                                                        </div>
                                                        Product Name
                                                        <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id="productName"
                                                        placeholder="e.g., SleepWell Pro Capsules"
                                                        value={formData.productName}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, productName: e.target.value })
                                                        }
                                                        onFocus={() => setFocusedField("productName")}
                                                        onBlur={() => setFocusedField(null)}
                                                        className="h-12 border-0 bg-transparent px-0 text-base font-medium placeholder:font-normal placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                        required
                                                    />
                                                    <p className="text-xs text-muted-foreground/60">
                                                        Commercial name of your supplement
                                                    </p>
                                                </motion.div>

                                                <motion.div
                                                    className={cn(
                                                        "group space-y-2.5 rounded-xl border p-4 transition-all duration-300",
                                                        focusedField === "category"
                                                            ? "border-primary/30 bg-primary/[0.02] shadow-sm shadow-primary/5"
                                                            : "border-border/40 bg-transparent hover:border-border/80"
                                                    )}
                                                >
                                                    <Label
                                                        htmlFor="category"
                                                        className="flex items-center gap-2 text-sm font-semibold"
                                                    >
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                                                            <Tag className="h-3.5 w-3.5 text-primary" />
                                                        </div>
                                                        Category
                                                        <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Select
                                                        value={formData.category}
                                                        onValueChange={(value) =>
                                                            setFormData({ ...formData, category: value })
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            onFocus={() => setFocusedField("category")}
                                                            onBlur={() => setFocusedField(null)}
                                                            className="h-12 border-0 bg-transparent px-0 text-base font-medium focus:ring-0 focus:ring-offset-0 [&>span]:text-muted-foreground/50 data-[state=open]:text-foreground"
                                                        >
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {PRODUCT_CATEGORIES.map((cat) => (
                                                                <SelectItem key={cat} value={cat}>
                                                                    {cat}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <p className="text-xs text-muted-foreground/60">
                                                        Determines analysis focus area
                                                    </p>
                                                </motion.div>
                                            </div>

                                            {/* ═══ Row 2: Ingredients ═══ */}
                                            <motion.div
                                                className={cn(
                                                    "group space-y-2.5 rounded-xl border p-4 transition-all duration-300",
                                                    focusedField === "ingredients"
                                                        ? "border-primary/30 bg-primary/[0.02] shadow-sm shadow-primary/5"
                                                        : "border-border/40 bg-transparent hover:border-border/80"
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <Label
                                                        htmlFor="ingredients"
                                                        className="flex items-center gap-2 text-sm font-semibold"
                                                    >
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                                                            <Beaker className="h-3.5 w-3.5 text-primary" />
                                                        </div>
                                                        Ingredient List with Dosages
                                                        <span className="text-destructive">*</span>
                                                    </Label>
                                                    {formData.ingredientsText && (
                                                        <Badge variant="secondary" className="text-[10px]">
                                                            {formData.ingredientsText.split("\n").filter(Boolean).length} ingredients
                                                        </Badge>
                                                    )}
                                                </div>
                                                <Textarea
                                                    id="ingredients"
                                                    placeholder={`
                                                        Melatonin - 5mg
                                                        Magnesium Glycinate - 400mg
                                                        L-Theanine - 200mg
                                                        Valerian Root Extract - 300mg
                                                        `}
                                                    value={formData.ingredientsText}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, ingredientsText: e.target.value })
                                                    }
                                                    onFocus={() => setFocusedField("ingredients")}
                                                    onBlur={() => setFocusedField(null)}
                                                    className="min-h-[200px] resize-y border-0 bg-transparent px-0 font-mono text-sm leading-7 placeholder:font-sans placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                    required
                                                />
                                                <div className="flex items-center justify-between border-t border-border/30 pt-2">
                                                    <p className="text-xs text-muted-foreground/50">
                                                        One ingredient per line: Name - Dosage
                                                    </p>
                                                    
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground/40">
                                                        <ShieldCheck className="h-3 w-3" />
                                                        Encrypted
                                                    </div>
                                                </div>
                                            </motion.div>

                                            {/* ═══ Row 3: Marketing Claims ═══ */}
                                            <motion.div
                                                className={cn(
                                                    "group space-y-2.5 rounded-xl border p-4 transition-all duration-300",
                                                    focusedField === "claims"
                                                        ? "border-primary/30 bg-primary/[0.02] shadow-sm shadow-primary/5"
                                                        : "border-border/40 bg-transparent hover:border-border/80"
                                                )}
                                            >
                                                <Label
                                                    htmlFor="claims"
                                                    className="flex items-center gap-2 text-sm font-semibold"
                                                >
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                                                        <MessageSquare className="h-3.5 w-3.5 text-primary" />
                                                    </div>
                                                    Marketing Claims
                                                    <Badge variant="secondary" className="ml-1 text-[10px] font-normal">
                                                        Optional
                                                    </Badge>
                                                </Label>
                                                <Textarea
                                                    id="claims"
                                                    placeholder={`"Clinically proven to induce deep sleep within 30 minutes"
                                                        "Non-habit forming sleep aid"
                                                        "100% natural formula with zero side effects"`}
                                                    value={formData.marketingClaims}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, marketingClaims: e.target.value })
                                                    }
                                                    onFocus={() => setFocusedField("claims")}
                                                    onBlur={() => setFocusedField(null)}
                                                    className="min-h-[130px] resize-y border-0 bg-transparent px-0 text-sm leading-7 placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                />
                                                <p className="text-xs text-muted-foreground/50">
                                                    AI will flag unsubstantiated or problematic claims against regulatory standards
                                                </p>
                                            </motion.div>

                                            {/* ═══ Error State ═══ */}
                                            <AnimatePresence>
                                                {error && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                        animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="flex items-start gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-5">
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                                                                <AlertCircle className="h-5 w-5 text-destructive" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-destructive">Analysis failed</p>
                                                                <p className="mt-1 text-sm text-destructive/70">{error}</p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* ═══ Action Bar ═══ */}
                                            <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={loadDemo}
                                                        className="gap-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                                                    >
                                                        <Zap className="h-3.5 w-3.5" />
                                                        Load Demo Data
                                                    </Button>
                                                    {!isConfigured && (
                                                        <Badge
                                                            variant="destructive"
                                                            className="gap-1.5 border-destructive/20 px-2.5 py-1 text-xs"
                                                        >
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
                                                        "group relative gap-3 overflow-hidden rounded-xl px-8 py-6 text-base font-semibold shadow-xl shadow-primary/20 transition-all",
                                                        "hover:shadow-primary/30 hover:brightness-110",
                                                        "disabled:opacity-70 disabled:cursor-not-allowed"
                                                    )}
                                                >
                                                    {/* Shimmer sweep */}
                                                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform group-hover:translate-x-full duration-1000" />
                                                    {isLoading ? (
                                                        <>
                                                            <Loader2 className="h-5 w-5 animate-spin" />
                                                            <span>Analyzing with Gemini AI...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Microscope className="h-5 w-5" />
                                                            <span>Analyze Formulation</span>
                                                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* ═══ Bottom Trust Bar ═══ */}
                            <motion.div
                                variants={itemVariants}
                                className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground/40"
                            >
                                <div className="flex items-center gap-1.5">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    HIPAA Compliant
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Gemini 2.5 Pro
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Zap className="h-3.5 w-3.5" />
                                    Real-time Analysis
                                </div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <AnalysisResultView result={result} onReset={handleReset} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}