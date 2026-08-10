import { useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";

interface NumberCardProps extends HTMLMotionProps<"div"> {
  number: number;
  isFlashed?: boolean;
  isDrawing?: boolean;
}

export function NumberCard({ number, isFlashed, isDrawing, className, ...props }: NumberCardProps) {
  // Generate a strip of random digits for the slot machine effect
  const [spinStrip] = useState(() => 
    Array.from({ length: 30 }, () => Math.floor(Math.random() * 99))
  );

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0, y: 30 }}
      animate={{ 
        scale: isFlashed ? 1.15 : 1, 
        opacity: 1,
        rotateX: isFlashed ? [0, 360] : 0,
        y: isFlashed ? -15 : 0
      }}
      transition={{ 
        type: "spring", 
        stiffness: isFlashed ? 150 : 400, 
        damping: isFlashed ? 12 : 25,
        mass: 1 
      }}
      className={cn(
        "relative flex items-center justify-center min-w-[100px] md:min-w-[160px] h-[100px] md:h-[130px] px-6 md:px-8 rounded-2xl md:rounded-3xl font-bold font-helvetica tabular-nums overflow-hidden",
        "border backdrop-blur-md transition-all duration-500",
        isFlashed 
          ? "border-accent/50 dark:border-accent shadow-[0_0_40px_rgba(70,254,145,0.4)] bg-accent/10 border-2 text-accent" 
          : "border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/20 shadow-xl text-text-main",
        className
      )}
      {...props}
    >
      {/* Background glow effect */}
      {isFlashed && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent -z-10"
        />
      )}

      {isDrawing ? (
        <motion.div
          className="absolute top-0 flex flex-col items-center justify-start w-full blur-[3px]"
          animate={{ y: ["0%", "-80%"] }}
          transition={{
            duration: 0.6,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {spinStrip.map((n, i) => (
            <div key={i} className="flex items-center justify-center h-[100px] md:h-[130px] text-7xl md:text-9xl opacity-70">
              {n}
            </div>
          ))}
        </motion.div>
      ) : (
        <span className="relative z-10 drop-shadow-md text-7xl md:text-9xl flex items-center justify-center h-full">
          {number}
        </span>
      )}
    </motion.div>
  );
}
