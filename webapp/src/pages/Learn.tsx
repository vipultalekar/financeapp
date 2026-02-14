"use client";

import { useState } from "react";
import {
  Lightbulb,
  Scale,
  TrendingUp,
  PiggyBank,
  Clock,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/navigation/BottomNav";
import { investmentTopics } from "@/data/mockData";
import type { InvestmentTopic } from "@/lib/types";
import { AnimatePage, AnimateList, AnimateItem, HoverScale } from "@/components/effects/AnimatePage";
import { Spotlight } from "@/components/effects/Spotlight";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import { AnimatedProgress } from "@/components/ui/AnimatedProgress";

const iconMap: Record<string, typeof Lightbulb> = {
  lightbulb: Lightbulb,
  scale: Scale,
  "trending-up": TrendingUp,
  "piggy-bank": PiggyBank,
  clock: Clock,
};

function TopicCard({
  topic,
  onClick,
}: {
  topic: InvestmentTopic;
  onClick: () => void;
}) {
  const Icon = iconMap[topic.icon] || Lightbulb;

  return (
    <HoverScale>
      <button
        onClick={onClick}
        className="w-full text-left group"
      >
        <Spotlight className="glass-card-3d p-5 border-white/5" color="hsla(217, 91%, 60%, 0.05)">
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm sm:text-base mb-1 text-white group-hover:text-primary transition-colors tracking-tight">
                {topic.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 font-medium">
                {topic.description}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm",
                    topic.riskLevel === "low" && "bg-success/20 text-white",
                    topic.riskLevel === "medium" && "bg-warning/20 text-warning",
                    topic.riskLevel === "high" && "bg-destructive/20 text-destructive"
                  )}
                >
                  {topic.riskLevel} Complexity
                </span>
                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">
                  {topic.timeHorizon}
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:translate-x-1 transition-all">
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </div>
          </div>
        </Spotlight>
      </button>
    </HoverScale>
  );
}

function TopicDetail({
  topic,
  onClose,
}: {
  topic: InvestmentTopic;
  onClose: () => void;
}) {
  const Icon = iconMap[topic.icon] || Lightbulb;

  return (
    <AnimatePage className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <FloatingOrbs variant="subtle" />

      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 z-20">
        <div className="flex items-center gap-3">
          <HoverScale>
            <button
              onClick={onClose}
              className="p-2 -ml-2 hover:bg-white/5 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </HoverScale>
          <span className="font-black uppercase tracking-[0.2em] text-xs text-muted-foreground">Finance Basics</span>
        </div>
      </header>

      <main className="px-6 py-10 relative z-10 max-w-3xl mx-auto">
        {/* Topic header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 text-center sm:text-left">
          <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center shrink-0 glow-teal shadow-2xl">
            <Icon className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter shimmer-text">{topic.title}</h1>
            <p className="text-lg text-muted-foreground font-medium">{topic.description}</p>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-10">
          <span
            className={cn(
              "text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full",
              topic.riskLevel === "low" && "bg-success/20 text-white",
              topic.riskLevel === "medium" && "bg-warning/20 text-warning",
              topic.riskLevel === "high" && "bg-destructive/20 text-destructive"
            )}
          >
            {topic.riskLevel === "low"
              ? "Beginner Friendly"
              : topic.riskLevel === "medium"
                ? "Developing Skills"
                : "Advanced Concepts"}
          </span>
          <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {topic.timeHorizon}
            </span>
          </div>
        </div>

        {/* Content */}
        <Spotlight className="glass-card-3d p-8 sm:p-12 mb-10" color="hsla(217, 91%, 60%, 0.05)">
          <div className="relative z-10 prose prose-invert prose-lg max-w-none">
            {topic.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="text-foreground/90 leading-relaxed mb-6 font-medium">
                {paragraph}
              </p>
            ))}
          </div>
        </Spotlight>

        {/* Call to action */}
        <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/20 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-4 animate-pulse" />
          <h3 className="text-xl font-bold mb-2">Dive Deeper?</h3>
          <p className="text-sm text-muted-foreground mb-6 font-medium">Rupiyo can answer specific questions about this topic based on your current financial state.</p>
          <HoverScale>
            <Button className="btn-3d px-10 h-14 bg-primary font-black uppercase tracking-widest text-xs">ASK RUPIYO</Button>
          </HoverScale>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-center pb-12">
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-white font-bold opacity-60 hover:opacity-100 transition-all">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Topics
          </Button>
        </div>
      </main>
    </AnimatePage>
  );
}

function RiskVisualizer() {
  return (
    <Spotlight className="glass-card-3d p-6 border-white/5" color="hsla(217, 91%, 60%, 0.05)">
      <div className="relative z-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Risk Guide</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mb-3">
              <span>Low Risk</span>
              <span>High Risk</span>
            </div>
            <div className="h-2.5 rounded-full bg-gradient-to-r from-success via-warning to-destructive opacity-80" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Savings", desc: "Predictable", color: "bg-success/10", textColor: "text-white" },
              { label: "Bonds", desc: "Stable", color: "bg-warning/10", textColor: "text-warning" },
              { label: "Stocks", desc: "Dynamic", color: "bg-destructive/10", textColor: "text-destructive" },
            ].map((item) => (
              <div key={item.label} className={cn("p-4 rounded-2xl border border-white/5", item.color)}>
                <p className={cn("text-xs font-black uppercase tracking-wider mb-1", item.textColor)}>{item.label}</p>
                <p className="text-[10px] text-muted-foreground font-bold">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed italic">
              "Higher risk often leads to higher potential rewards, but requires patience. Time is your greatest asset in weathering market cycles."
            </p>
          </div>
        </div>
      </div>
    </Spotlight>
  );
}

export default function Learn() {
  const [selectedTopic, setSelectedTopic] = useState<InvestmentTopic | null>(
    null
  );

  if (selectedTopic) {
    return (
      <TopicDetail
        topic={selectedTopic}
        onClose={() => setSelectedTopic(null)}
      />
    );
  }

  return (
    <AnimatePage>
      <div className="min-h-screen bg-background pb-nav relative overflow-hidden">
        <FloatingOrbs variant="default" />

        {/* Header */}
        <header className="relative z-10 px-6 pt-10 pb-6">
          <h1 className="text-3xl font-black text-white tracking-tight shimmer-text">Learn</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">
            Master your money with zero jargon
          </p>
        </header>

        <main className="relative z-10 px-6 space-y-8 pb-32">
          {/* Intro card */}
          <div className="glass-card p-6 bg-primary/5 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
            <p className="text-sm font-bold text-foreground/80 leading-relaxed relative z-10">
              Simple explanations to help you grow your money. No finance degree required.
            </p>
          </div>

          {/* Risk visualizer */}
          <RiskVisualizer />

          {/* Topics */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">
              Topics
            </h3>
            <AnimateList className="space-y-4">
              {investmentTopics.map((topic) => (
                <AnimateItem key={topic.id}>
                  <TopicCard
                    topic={topic}
                    onClick={() => setSelectedTopic(topic)}
                  />
                </AnimateItem>
              ))}
            </AnimateList>
          </div>

          {/* Quick questions */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">
              Quick Questions
            </h3>
            <Spotlight className="glass-card-3d border-white/5 overflow-hidden" color="hsla(217, 91%, 60%, 0.05)">
              <div className="divide-y divide-white/5 relative z-10">
                {[
                  "Is investing like gambling?",
                  "What's the right amount to start?",
                  "Managing market downturns",
                ].map((question) => (
                  <button
                    key={question}
                    className="w-full p-5 text-left text-sm hover:bg-white/5 transition-all flex items-center justify-between group"
                  >
                    <span className="font-bold text-white group-hover:text-primary transition-colors">{question}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </Spotlight>
          </div>
        </main>

        <BottomNav />
      </div>
    </AnimatePage>
  );
}
