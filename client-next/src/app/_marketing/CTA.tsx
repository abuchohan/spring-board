"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export function CTA() {
  return (
    <section className="py-20 md:py-28 bg-background px-6 text-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="max-w-2xl mx-auto"
      >
        <motion.h2
          variants={fadeIn}
          className="text-3xl md:text-4xl font-bold tracking-tight"
        >
          Ready to start building?
        </motion.h2>
        <motion.p variants={fadeIn} className="text-muted-foreground mt-4">
          Skip the setup. Ship the thing.
        </motion.p>
        <motion.div variants={fadeIn}>
          <Button
            size="lg"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg h-12 px-8 text-base mt-8"
            asChild
          >
            <Link href="/register">
              Get Started Free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
