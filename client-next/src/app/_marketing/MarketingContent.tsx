"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

import { Hero } from "./Hero";
import { Problem } from "./Problem";
import { HowItWorks } from "./HowItWorks";
import { Features } from "./Features";
import { CTA } from "./CTA";

const CURRENT_YEAR = new Date().getFullYear();

export function MarketingContent() {
  const featuresRef = useRef<HTMLElement | null>(null);

  const scrollToFeatures = useCallback(() => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/40 border-b border-border/20">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-base tracking-tight">
            <div className="size-7 rounded-lg bg-secondary flex items-center justify-center">
              <Zap className="size-4 text-secondary-foreground fill-secondary-foreground" />
            </div>
            Spring Board
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Hero onScrollToFeatures={scrollToFeatures} />
        <Problem />
        <HowItWorks />
        <Features sectionRef={featuresRef} />
        <CTA />
      </main>

      <footer className="py-10 border-t border-border/50 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 font-bold text-sm tracking-tight">
            <div className="size-6 rounded bg-secondary flex items-center justify-center">
              <Zap className="size-3.5 text-secondary-foreground fill-secondary-foreground" />
            </div>
            Spring Board
          </div>
          <p className="text-xs text-muted-foreground">
            © {CURRENT_YEAR} Spring Board. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
