"use client";

import { motion } from "framer-motion";
import { Copy, Paintbrush, Rocket } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const steps = [
  {
    num: "1",
    icon: Copy,
    title: "Clone & configure",
    body: "Fork the repo, copy the .env.example, run pnpm install. You're up in minutes, not hours.",
  },
  {
    num: "2",
    icon: Paintbrush,
    title: "Customise your UI",
    body: "Swap out the colour tokens, update the copy, and make it yours. shadcn components are yours to own.",
  },
  {
    num: "3",
    icon: Rocket,
    title: "Ship to production",
    body: "Push to Vercel. Everything — auth, email, DB — is already wired for prod. Just add your env vars.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-background px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.p
            variants={fadeIn}
            className="text-xs font-medium uppercase tracking-widest text-[#C5A059] mb-3"
          >
            How it works
          </motion.p>
          <motion.h2
            variants={fadeIn}
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            From zero to deployed in a day
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid md:grid-cols-3 gap-8"
        >
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                variants={fadeIn}
                className="relative text-center"
              >
                <span
                  className="absolute -top-4 -left-2 text-7xl font-bold text-[#C5A059] opacity-15 select-none pointer-events-none"
                  aria-hidden="true"
                >
                  {step.num}
                </span>
                <div className="size-14 rounded-full bg-secondary/10 flex items-center justify-center mb-4 mx-auto">
                  <Icon className="size-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
