"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

import LineWaves from "@/components/LineWaves";
import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

interface HeroProps {
  onScrollToFeatures: () => void;
}

export function Hero({ onScrollToFeatures }: HeroProps) {
  return (
    <section className="pt-32 pb-20 md:pt-44 md:pb-28 text-center px-6 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <LineWaves
          speed={0.3}
          innerLineCount={32}
          outerLineCount={36}
          warpIntensity={1}
          rotation={-45}
          edgeFadeWidth={0}
          colorCycleSpeed={1}
          brightness={0.2}
          color1="#7F77DD"
          color2="#7F77DD"
          color3="#7F77DD"
          enableMouseInteraction={false}
          mouseInfluence={2}
        />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px]" />
      </div>
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex flex-col items-center"
        >
          <motion.div variants={fadeIn} className="flex items-center gap-2 font-bold text-xl tracking-tight mb-8">
            <div className="size-8 rounded-lg bg-secondary flex items-center justify-center">
              <Zap className="size-5 text-secondary-foreground fill-secondary-foreground" />
            </div>
            Spring Board
          </motion.div>

          <motion.h1
            variants={fadeIn}
            className="text-4xl md:text-6xl font-bold tracking-tight leading-tight"
          >
            Build your next idea,
            <br />
            <span className="text-secondary">faster than ever.</span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed"
          >
            The full-stack starter kit with authentication, database, tRPC,
            and a beautiful UI — all pre-configured so you can focus on
            building.
          </motion.p>

          <motion.div
            variants={fadeIn}
            className="flex flex-col sm:flex-row gap-3 justify-center mt-10"
          >
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg h-12 px-8 text-base"
              asChild
            >
              <Link href="/register">
                Get Started Free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base"
              onClick={onScrollToFeatures}
            >
              See Features
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
