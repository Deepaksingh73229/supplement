"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Microscope,
  ArrowLeft,
  Download,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Copy,
  AlertCircle,
  TrendingUp,
  Clock,
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Beaker,
  FlaskConical,
  ShieldCheck,
  Ban,
  Lightbulb,
  Activity,
  Pill,
  BarChart3,
  FileJson,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnalysisResult } from "@/types";
import { riskBadgeColor, scoreColor, scoreRingColor, riskColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function AnimatedScoreRing({ score }: { score: number }) {
  const radius = 58;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const colorClass = scoreRingColor(score);

  return (
    <div className="relative flex items-center justify-center">
      <div className={cn("absolute h-40 w-40 rounded-full blur-2xl opacity-20", colorClass.replace(/stroke-/g, "bg-").replace(/text-/g, "bg-"))} />
      <svg height={radius * 2} width={radius * 2} className="-rotate-90">
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-muted/15"
        />
        <motion.circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={cn(colorClass, "drop-shadow-lg")}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          className={cn("text-4xl font-bold tabular-nums", scoreColor(score))}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {score}
        </motion.span>
        <span className="text-xs font-medium text-muted-foreground/60 mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

export function AnalysisResultView({ result, onReset }: Props) {
  const [activeTab, setActiveTab] = useState("ingredients");
  const [expandedObservations, setExpandedObservations] = useState<Set<string>>(new Set());
  const [expandedIngredients, setExpandedIngredients] = useState<Set<string>>(new Set());

  const toggleObservation = (id: string) => {
    const next = new Set(expandedObservations);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedObservations(next);
  };

  const toggleIngredient = (name: string) => {
    const next = new Set(expandedIngredients);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setExpandedIngredients(next);
  };

  const getObservationIcon = (category: string) => {
    switch (category) {
      case "synergy": return <Zap className="h-4 w-4" />;
      case "redundancy": return <Copy className="h-4 w-4" />;
      case "gap": return <AlertCircle className="h-4 w-4" />;
      case "safety": return <Shield className="h-4 w-4" />;
      case "efficacy": return <TrendingUp className="h-4 w-4" />;
      case "stability": return <Clock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getObservationColor = (type: string) => {
    switch (type) {
      case "positive": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "negative": return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "warning": return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      default: return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
    }
  };

  const getObservationIconColor = (type: string) => {
    switch (type) {
      case "positive": return "text-emerald-500";
      case "negative": return "text-rose-500";
      case "warning": return "text-amber-500";
      default: return "text-slate-500";
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.productName.replace(/\s+/g, "_")}_analysis.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: "ingredients", label: "Ingredients", icon: Beaker, count: result.ingredients.length },
    { id: "observations", label: "Observations", icon: Lightbulb, count: result.observations.length },
    { id: "claims", label: "Claims", icon: ShieldCheck, count: result.claims.length },
    { id: "review", label: "AI Review", icon: Sparkles },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ═══ Cinematic Background ═══ */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-20 right-1/4 h-[500px] w-[500px] rounded-full bg-primary/[0.03] blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/[0.025] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-8">
        <motion.div variants={container} initial="hidden" animate="show">
          {/* ═══ Header Bar ═══ */}
          <motion.div variants={item} className="mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReset}
                  className="group gap-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  New Analysis
                </Button>
                <div className="h-6 w-px bg-border" />
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20">
                    <FlaskConical className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                      {result.productName}
                    </h1>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-xs font-normal">
                        {result.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {result.ingredients.length} ingredients analyzed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-2 rounded-lg border-border/60 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <FileJson className="h-4 w-4" />
                Export JSON
              </Button>
            </div>
          </motion.div>

          {/* ═══ Score Hero Card ═══ */}
          <motion.div variants={item}>
            <Card className="overflow-hidden border-0 bg-card/60 shadow-xl shadow-primary/[0.03] ring-1 ring-border/40 backdrop-blur-xl">
              <div className="relative h-1 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              </div>
              <CardContent className="p-8">
                <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
                  <div className="shrink-0">
                    <AnimatedScoreRing score={result.overallScore} />
                  </div>
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap md:justify-start">
                      <Badge
                        className={cn(
                          "px-4 py-1.5 text-sm font-bold uppercase tracking-wider",
                          riskBadgeColor(result.overallRisk)
                        )}
                      >
                        {result.overallRisk} Risk
                      </Badge>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Activity className="h-3.5 w-3.5" />
                        Overall Safety Score
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {result.aiReview}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2 md:justify-start">
                      <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5">
                        <Pill className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">
                          {result.ingredients.length} Ingredients
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5">
                        <Lightbulb className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">
                          {result.observations.length} Observations
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5">
                        <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">
                          {result.claims.length} Claims Reviewed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ═══ Modern Tabs ═══ */}
          <motion.div variants={item} className="mt-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="relative mb-6">
                <TabsList className="relative flex h-auto w-full justify-start gap-1 rounded-xl bg-transparent p-1 sm:w-auto">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className={cn(
                        "relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                        "data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm",
                        "data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-accent/50"
                      )}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      {tab.count !== undefined && (
                        <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          {tab.count}
                        </span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* ─── Ingredients Tab ─── */}
              <TabsContent value="ingredients" className="mt-0">
                <motion.div variants={container} initial="hidden" animate="show" className="grid gap-3">
                  {result.ingredients.map((ing, idx) => (
                    <motion.div key={ing.name} variants={item}>
                      <Card
                        className={cn(
                          "overflow-hidden border-0 bg-card/60 shadow-sm ring-1 ring-border/40 backdrop-blur-sm transition-all duration-300",
                          expandedIngredients.has(ing.name) && "shadow-md ring-primary/10"
                        )}
                      >
                        <div
                          className="cursor-pointer p-5 transition-colors hover:bg-accent/30"
                          onClick={() => toggleIngredient(ing.name)}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/80 text-xs font-bold text-muted-foreground">
                                {idx + 1}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-semibold text-foreground">{ing.name}</h4>
                                  {ing.isNovel && (
                                    <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-600">
                                      Novel
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <Badge variant="secondary" className="text-xs font-normal">
                                    {ing.dosage}
                                  </Badge>
                                  {ing.category && (
                                    <Badge variant="outline" className="text-xs font-normal">
                                      {ing.category}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              {ing.riskLevel && (
                                <Badge className={cn("text-xs", riskBadgeColor(ing.riskLevel))}>
                                  {ing.riskLevel}
                                </Badge>
                              )}
                              <motion.div
                                animate={{ rotate: expandedIngredients.has(ing.name) ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              </motion.div>
                            </div>
                          </div>
                        </div>
                        <AnimatePresence>
                          {expandedIngredients.has(ing.name) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-border/40 bg-muted/20 px-5 py-5">
                                <div className="grid gap-4 text-sm">
                                  {ing.description && (
                                    <p className="text-muted-foreground leading-relaxed">
                                      {ing.description}
                                    </p>
                                  )}
                                  {ing.standardDosage && (
                                    <div className="flex items-center gap-2 rounded-lg bg-background/60 px-4 py-3">
                                      <span className="text-muted-foreground">Standard Dosage:</span>
                                      <span className="font-semibold text-foreground">{ing.standardDosage}</span>
                                    </div>
                                  )}
                                  {ing.riskReason && (
                                    <div className={cn(
                                      "rounded-xl border p-4",
                                      riskColor(ing.riskLevel || "low").replace("bg-", "border-").replace("/10", "/20"),
                                      riskColor(ing.riskLevel || "low")
                                    )}>
                                      <div className="flex items-center gap-2 font-semibold mb-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        Risk Assessment
                                      </div>
                                      <p className="leading-relaxed opacity-90">{ing.riskReason}</p>
                                    </div>
                                  )}
                                  {ing.interactions && ing.interactions.length > 0 && (
                                    <div>
                                      <span className="text-sm font-semibold text-foreground">Interactions:</span>
                                      <ul className="mt-2 space-y-2">
                                        {ing.interactions.map((interaction, i) => (
                                          <li key={i} className="flex items-start gap-2.5 rounded-lg bg-background/60 px-3 py-2">
                                            <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                                            <span className="text-muted-foreground">{interaction}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              {/* ─── Observations Tab ─── */}
              <TabsContent value="observations" className="mt-0">
                <motion.div variants={container} initial="hidden" animate="show" className="grid gap-3">
                  {result.observations.map((obs) => (
                    <motion.div key={obs.id} variants={item}>
                      <Card
                        className={cn(
                          "overflow-hidden border-0 bg-card/60 shadow-sm ring-1 ring-border/40 backdrop-blur-sm transition-all duration-300",
                          expandedObservations.has(obs.id) && "shadow-md"
                        )}
                      >
                        <div
                          className="cursor-pointer p-5 transition-colors hover:bg-accent/30"
                          onClick={() => toggleObservation(obs.id)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className={cn(
                                "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                                getObservationColor(obs.type)
                              )}>
                                {getObservationIcon(obs.category)}
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground">{obs.title}</h4>
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                  <Badge variant="outline" className="text-[10px] capitalize">
                                    {obs.category}
                                  </Badge>
                                  <Badge variant="ghost" className={cn("text-[10px] capitalize", getObservationIconColor(obs.type))}>
                                    {obs.type}
                                  </Badge>
                                  {obs.severity && (
                                    <Badge className={cn("text-[10px]", riskBadgeColor(obs.severity))}>
                                      {obs.severity}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <motion.div
                              animate={{ rotate: expandedObservations.has(obs.id) ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="shrink-0 mt-1"
                            >
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </motion.div>
                          </div>
                        </div>
                        <AnimatePresence>
                          {expandedObservations.has(obs.id) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-border/40 px-5 py-4">
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                  {obs.description}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              {/* ─── Claims Tab ─── */}
              <TabsContent value="claims" className="mt-0">
                <motion.div variants={container} initial="hidden" animate="show" className="grid gap-3">
                  {result.claims.map((claim, idx) => (
                    <motion.div key={idx} variants={item}>
                      <Card
                        className={cn(
                          "overflow-hidden border-0 bg-card/60 shadow-sm ring-1 backdrop-blur-sm transition-all duration-300",
                          claim.isProblematic
                            ? "ring-rose-500/20 hover:ring-rose-500/30"
                            : "ring-emerald-500/20 hover:ring-emerald-500/30"
                        )}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                              claim.isProblematic ? "bg-rose-500/10" : "bg-emerald-500/10"
                            )}>
                              {claim.isProblematic ? (
                                <Ban className="h-5 w-5 text-rose-500" />
                              ) : (
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                              )}
                            </div>
                            <div className="flex-1 space-y-3">
                              <div>
                                <h4 className="font-semibold text-foreground">
                                  &ldquo;{claim.claim}&rdquo;
                                </h4>
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                  <Badge
                                    variant={claim.isProblematic ? "destructive" : "default"}
                                    className="text-xs"
                                  >
                                    {claim.isProblematic ? "Problematic" : "Compliant"}
                                  </Badge>
                                  <Badge className={cn("text-xs", riskBadgeColor(claim.severity))}>
                                    {claim.severity}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm leading-relaxed text-muted-foreground">
                                {claim.reason}
                              </p>
                              {claim.regulation && (
                                <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    <span className="font-medium text-foreground">Regulation:</span>{" "}
                                    {claim.regulation}
                                  </span>
                                </div>
                              )}
                              {claim.suggestion && (
                                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Lightbulb className="h-4 w-4 text-emerald-500" />
                                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                      Suggested Alternative
                                    </span>
                                  </div>
                                  <p className="text-sm text-emerald-700/80 dark:text-emerald-400/80">
                                    {claim.suggestion}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              {/* ─── AI Review Tab ─── */}
              <TabsContent value="review" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Card className="overflow-hidden border-0 bg-card/60 shadow-xl shadow-primary/[0.03] ring-1 ring-border/40 backdrop-blur-xl">
                    <div className="relative h-1 w-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                    </div>
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold tracking-tight">AI Review Summary</h3>
                          <p className="text-xs text-muted-foreground">
                            Comprehensive professional review generated by Gemini AI
                          </p>
                        </div>
                      </div>
                      <ScrollArea className="h-[500px] pr-4">
                        <div className="space-y-4 text-sm leading-[1.8] whitespace-pre-wrap text-muted-foreground">
                          {result.aiReview}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}