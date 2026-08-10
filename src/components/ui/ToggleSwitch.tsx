
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <label className="flex items-center cursor-pointer select-none group">
      <div className="relative flex items-center">
        <input 
          type="checkbox" 
          className="sr-only" 
          checked={checked} 
          onChange={(e) => onChange(e.target.checked)} 
        />
        <div className={cn(
          "block w-14 h-7 rounded-full transition-colors duration-300 border border-border-switch/50 shadow-inner",
          checked ? "bg-primary dark:bg-accent/80" : "bg-bg-switch"
        )} />
        <motion.div 
          className={cn(
            "absolute left-1 top-1 w-5 h-5 rounded-full shadow-md flex items-center justify-center",
            checked ? "bg-white" : "bg-bg-switch-handle"
          )}
          initial={false}
          animate={{
            x: checked ? 28 : 0,
            scale: checked ? 1.1 : 1
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {checked && (
            <motion.svg 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-3 h-3 text-primary dark:text-black" 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </motion.svg>
          )}
        </motion.div>
      </div>
      <span className="ml-4 text-base md:text-lg text-text-muted group-hover:text-text-main transition-colors duration-300 font-medium">
        {label}
      </span>
    </label>
  );
}
