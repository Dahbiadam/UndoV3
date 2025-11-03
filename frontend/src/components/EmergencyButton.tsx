'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface EmergencyButtonProps {
  onClick: () => void;
  className?: string;
}

export function EmergencyButton({ onClick, className = '' }: EmergencyButtonProps) {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    setIsPulsing(true);
  }, []);

  return (
    <motion.button
      onClick={onClick}
      className={`
        relative w-48 h-48 md:w-64 md:h-64 rounded-full
        bg-gradient-to-r from-red-500 to-red-600
        text-white font-bold text-lg md:text-xl
        shadow-2xl
        hover:scale-105
        active:scale-95
        transition-all duration-200
        focus:outline-none
        focus:ring-4 focus:ring-red-300
        cursor-pointer
        ${className}
      `}
      animate={{
        scale: isPulsing ? [1, 1.1, 1] : [1],
        transition: {
          duration: 1.5,
          repeat: isPulsing ? Infinity : 0,
          ease: "easeInOut",
        },
      }}
      whileHover={{
        scale: 1.1,
        boxShadow: "0 0 30px rgba(239, 68, 68, 0.5)",
      }}
    >
      <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75"></span>
      <span className="relative z-10 flex items-center justify-center">
        <span className="text-2xl md:text-3xl">HELP</span>
        <span className="text-xs md:text-sm block mt-1">NOW</span>
      </span>
    </motion.button>
  );
}