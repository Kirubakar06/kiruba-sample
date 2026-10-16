import React from 'react';
import { motion } from 'framer-motion';
import { WiCloudy } from 'react-icons/wi';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.2, duration: 0.6 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070b19]"
    >
      <div className="relative flex flex-col items-center">
        {/* Floating Clouds Background */}
        <motion.div
          animate={{
            x: [-15, 15, -15],
            y: [-5, 5, -5]
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: 'easeInOut'
          }}
          className="absolute -top-16 text-sky-400/20 text-[120px] pointer-events-none"
        >
          <WiCloudy />
        </motion.div>

        {/* Brand Logo & Name */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center gap-1 z-10"
        >
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <span className="text-3xl font-bold text-white tracking-wider">S</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mt-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            SkyCast
          </h1>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">
            Smart Weather Engine
          </p>
        </motion.div>

        {/* Loading Indicator */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full"
            />
          </div>
          <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase animate-pulse">
            Initializing Engine & API Cache...
          </span>
        </div>
      </div>
    </motion.div>
  );
};
