import { motion } from "motion/react"

const SPRING = {
  type: "spring",
  damping: 10,
  mass: 0.75,
  stiffness: 100,
}

export default function AnimatedProgressBar({
  value,
  label,
  color = "#6366f1",
  className = "",
  barClassName = "",
  labelClassName = ""
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className={`mb-1 text-sm font-medium ${labelClassName}`}>
          {label}
        </div>
      )}
      <div
        className="bg-background relative h-3 w-full overflow-hidden rounded border">
        <motion.div
          className={`bg-background h-full rounded ${barClassName}`}
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          transition={SPRING} />
      </div>
    </div>
  );
}
