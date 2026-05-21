"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  description,
  index = 0,
  className,
}: {
  title: string;
  description: string;
  index?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className={cn("panel h-full p-6", className)}
    >
      <h3 className="text-xl font-black text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </motion.div>
  );
}
