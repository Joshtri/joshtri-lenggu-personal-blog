"use client";

import type React from "react";

import { motion } from "framer-motion";
import { FileQuestion } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  icon = <FileQuestion className="w-12 h-12 text-gray-300" />,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center p-10 bg-gray-50 border border-dashed border-gray-200 rounded-xl"
    >
      <div className="bg-white p-4 rounded-full shadow-sm mb-4">{icon}</div>
      <h3 className="text-xl font-medium text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md">{description}</p>
    </motion.div>
  );
}
