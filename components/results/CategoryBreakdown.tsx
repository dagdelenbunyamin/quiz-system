"use client"

import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

type CategoryBreakdownProps = {
  categories: Record<string, { total: number; correct: number }>
}

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  return (
    <div className="space-y-4">
      {Object.entries(categories).map(([category, data], index) => {
        const percentage = Math.round((data.correct / data.total) * 100)

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.3 }}
          >
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {data.correct}/{data.total} ({percentage}%)
              </span>
            </div>
            <Progress
              value={percentage}
              className="h-2"
              indicatorClassName={
                percentage >= 80
                  ? "bg-green-500"
                  : percentage >= 60
                    ? "bg-emerald-500"
                    : percentage >= 40
                      ? "bg-yellow-500"
                      : "bg-red-500"
              }
            />
          </motion.div>
        )
      })}
    </div>
  )
}
