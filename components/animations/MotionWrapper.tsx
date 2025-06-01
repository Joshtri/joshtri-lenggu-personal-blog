"use client";

import { motion } from "framer-motion";
import type { ReactNode, ElementType } from "react";

interface MotionWrapperProps {
  children: ReactNode;
  as?: ElementType; // <div>, <section>, <article>, etc.
  className?: string;
  variants?: any;
  initialY?: number;
  duration?: number;
  delay?: number;
}

export default function MotionWrapper({
  children,
  as: Component = "div", // default ke <div>
  className,
  variants,
  initialY = -20,
  duration = 0.6,
  delay = 0,
}: MotionWrapperProps) {
  const MotionComponent = motion(Component);

  const defaultMotionProps = {
    initial: { opacity: 0, y: initialY },
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay },
  };

  return (
    <MotionComponent
      className={className}
      {...(variants
        ? { variants, initial: "hidden", animate: "visible" }
        : defaultMotionProps)}
    >
      {children}
    </MotionComponent>
  );
}
