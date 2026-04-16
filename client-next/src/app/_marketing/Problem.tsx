"use client";

import { motion } from "framer-motion";
import { Clock, Puzzle, ShieldOff } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const problemCards = [
  {
    icon: Clock,
    title: "Weeks lost to boilerplate",
    body: "Auth flows, session management, password resets — every new project starts the same way. That's weeks of your life gone before you write a single line of your actual app.",
  },
  {
    icon: Puzzle,
    title: "Gluing packages together",
    body: "Picking a router, an ORM, a UI library, a state manager — then making them all play nice. It shouldn't take a week just to configure the stack.",
  },
  {
    icon: ShieldOff,
    title: "Security as an afterthought",
    body: "Cookie flags, CSRF, rate limiting, session expiry — easy to forget, painful to add later. Security should be baked in from day one.",
  },
];

export function Problem() {
  return (
    <section className="py-20 md:py-28 bg-muted/30 px-6">
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
            Sound familiar?
          </motion.p>
          <motion.h2
            variants={fadeIn}
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Every project starts the same way
          </motion.h2>
          <motion.p variants={fadeIn} className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Most starters get you Hello World. Spring Board gets you to
            production-ready.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid md:grid-cols-3 gap-6"
        >
          {problemCards.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={fadeIn}
                className="rounded-xl border border-border/50 bg-background p-6 h-full"
              >
                <div className="p-3 rounded-lg bg-secondary/10 w-fit mb-4">
                  <Icon className="size-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
