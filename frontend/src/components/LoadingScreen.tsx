'use client';

import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-background))]">
      <motion.div
        className="flex flex-col items-center space-y-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.35,
          ease: [0.33, 0, 0, 1],
        }}
      >
        {/* UNDO Logo Animation */}
        <motion.div
          className="relative"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: [0.33, 0, 0.66, 1],
          }}
        >
          <div className="w-20 h-20 rounded-2xl glass-morphism flex items-center justify-center">
            <span className="text-title-1 font-bold text-[rgb(var(--color-system-blue))]">
              U
            </span>
          </div>

          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 w-20 h-20 rounded-2xl border-2 border-[rgb(var(--color-system-blue))] opacity-0"
            animate={{
              opacity: [0, 0.5, 0],
              scale: [1, 1.3, 1.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: [0.33, 0, 0.66, 1],
            }}
          />
        </motion.div>

        {/* App Name */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            delay: 0.1,
            ease: [0.33, 0, 0, 1],
          }}
        >
          <h1 className="text-large-title font-bold text-[rgb(var(--color-text-primary))] mb-2">
            UNDO
          </h1>
          <p className="text-body text-[rgb(var(--color-text-secondary))]">
            Reset Your Mind. Rebuild Your Life.
          </p>
        </motion.div>

        {/* Loading Dots */}
        <motion.div
          className="flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.35,
            delay: 0.2,
            ease: [0.33, 0, 0, 1],
          }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 rounded-full bg-[rgb(var(--color-system-blue))]"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: [0.33, 0, 0.66, 1],
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}