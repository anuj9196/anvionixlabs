'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  children: string;
  className?: string;
}

export function SectionTitle({ children, className }: SectionTitleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.25'],
  });

  const words = children.split(' ');

  return (
    <div ref={ref} className={cn('relative', className)}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <motion.span
            key={i}
            className="inline-block"
            style={{
              opacity: useTransform(scrollYProgress, [start, end], [0, 1]),
              y: useTransform(scrollYProgress, [start, end], [20, 0]),
            }}
          >
            {word}
            {i < words.length - 1 && '\u00A0'}
          </motion.span>
        );
      })}
    </div>
  );
}


