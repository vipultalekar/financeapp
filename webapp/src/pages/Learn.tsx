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
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/navigation/BottomNav";
import { investmentTopics } from "@/data/mockData";
import type { InvestmentTopic } from "@/lib/types";

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
    <button
      onClick={onClick}
      className="glass-card p-5 w-full text-left hover:border-border/80 transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
            {topic.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {topic.description}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                topic.riskLevel === "low" && "bg-success/20 text-success",
                topic.riskLevel === "medium" && "bg-warning/20 text-warning",
                topic.riskLevel === "high" && "bg-destructive/20 text-destructive"
              )}
            >
              {topic.riskLevel} complexity
            </span>
            <span className="text-xs text-muted-foreground">
              {topic.timeHorizon}
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all shrink-0" />
      </div>
    </button>
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
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 -ml-2 hover:bg-secondary rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold">Learn</span>
        </div>
      </header>

      <main className="px-6 py-6">
        {/* Topic header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">{topic.title}</h1>
            <p className="text-muted-foreground">{topic.description}</p>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-4 mb-6">
          <span
            className={cn(
              "text-sm px-3 py-1 rounded-full",
              topic.riskLevel === "low" && "bg-success/20 text-success",
              topic.riskLevel === "medium" && "bg-warning/20 text-warning",
              topic.riskLevel === "high" && "bg-destructive/20 text-destructive"
            )}
          >
            {topic.riskLevel === "low"
              ? "Beginner friendly"
              : topic.riskLevel === "medium"
              ? "Some prior knowledge helpful"
              : "More advanced"}
          </span>
          <span className="text-sm text-muted-foreground">
            {topic.timeHorizon}
          </span>
        </div>

        {/* Content */}
        <div className="glass-card p-6">
          <div className="prose prose-invert prose-sm max-w-none">
            {topic.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="text-foreground/90 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-6 p-5 rounded-xl bg-primary/10 border border-primary/20">
          <p className="text-sm font-medium mb-3">Want to explore further?</p>
          <Button className="w-full">Ask the AI Coach</Button>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to topics
          </Button>
        </div>
      </main>
    </div>
  );
}

function RiskVisualizer() {
  return (
    <div className="glass-card p-5">
      <h3 className="font-semibold mb-4">Understanding Risk</h3>
      <div className="space-y-4">
        {/* Risk spectrum */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Lower risk</span>
            <span>Higher risk</span>
          </div>
          <div className="h-3 rounded-full bg-gradient-to-r from-success via-warning to-destructive" />
        </div>

        {/* Risk levels explained */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 rounded-xl bg-success/10">
            <p className="text-xs text-success font-medium mb-1">Savings</p>
            <p className="text-xs text-muted-foreground">
              Stable, predictable
            </p>
          </div>
          <div className="p-3 rounded-xl bg-warning/10">
            <p className="text-xs text-warning font-medium mb-1">Bonds</p>
            <p className="text-xs text-muted-foreground">
              Some ups and downs
            </p>
          </div>
          <div className="p-3 rounded-xl bg-destructive/10">
            <p className="text-xs text-destructive font-medium mb-1">Stocks</p>
            <p className="text-xs text-muted-foreground">
              More volatile
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Higher risk can mean higher potential returns, but also bigger losses.
          Time is your friend - longer horizons can weather short-term dips.
        </p>
      </div>
    </div>
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
    <div className="min-h-screen bg-background pb-nav">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold mb-1">Learn</h1>
        <p className="text-muted-foreground">
          Investing explained like you're smart but new to this
        </p>
      </header>

      <main className="px-6 space-y-6">
        {/* Intro card */}
        <div className="glass-card p-5 bg-primary/5 border-primary/20">
          <p className="text-sm">
            No finance degree required. Just plain-language explanations to help
            you feel confident about your money decisions.
          </p>
        </div>

        {/* Risk visualizer */}
        <RiskVisualizer />

        {/* Topics */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Start Learning
          </h3>
          <div className="space-y-3">
            {investmentTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onClick={() => setSelectedTopic(topic)}
              />
            ))}
          </div>
        </div>

        {/* Quick questions */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Common Questions
          </h3>
          <div className="glass-card divide-y divide-border/50">
            {[
              "Is investing gambling?",
              "How much should I invest?",
              "What if I lose everything?",
            ].map((question) => (
              <button
                key={question}
                className="w-full p-4 text-left text-sm hover:bg-secondary/50 transition-colors flex items-center justify-between group"
              >
                <span>{question}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
