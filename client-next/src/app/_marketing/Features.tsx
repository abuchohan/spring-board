"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Code2, Database, Layout, Mail, ShieldCheck } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const features = [
  {
    icon: ShieldCheck,
    title: "Session auth",
    body: "Cookie-based sessions with httpOnly flags, rate limiting, and password reset flows built in.",
  },
  {
    icon: Code2,
    title: "tRPC end-to-end",
    body: "Type-safe API calls from client to server. No REST boilerplate, no schema drift.",
  },
  {
    icon: Database,
    title: "Prisma ORM",
    body: "Type-safe database access with PostgreSQL. Migrations, seeding, and Prisma Studio included.",
  },
  {
    icon: Layout,
    title: "shadcn/ui components",
    body: "Accessible, themeable components using Radix UI primitives and Tailwind CSS v4.",
  },
  {
    icon: Mail,
    title: "Transactional email",
    body: "Welcome emails and password resets via Resend — templated HTML ready to customise.",
  },
  {
    icon: CheckCircle2,
    title: "Production-ready patterns",
    body: "OAuth via Arctic, dark mode, Next.js middleware auth guards, and structured error handling.",
  },
];

interface FeaturesProps {
  sectionRef: React.RefObject<HTMLElement | null>;
}

export function Features({ sectionRef }: FeaturesProps) {
  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-muted/30 px-6">
      <div className="max-w-5xl mx-auto">
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
            Features
          </motion.p>
          <motion.h2
            variants={fadeIn}
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Everything you need, nothing you don&apos;t
          </motion.h2>
          <motion.p variants={fadeIn} className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Spring Board ships the hard parts. You focus on what makes your
            app unique.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={fadeIn}
                className="p-6 rounded-xl border border-border/50 bg-background hover:border-secondary/30 transition-colors group"
              >
                <div className="p-2.5 rounded-lg bg-secondary/10 w-fit mb-3 group-hover:bg-secondary/15 transition-colors">
                  <Icon className="size-5 text-secondary" />
                </div>
                <h3 className="text-base font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.body}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
