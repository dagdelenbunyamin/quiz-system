"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

type ResultsChartProps = {
  correctAnswers: number
  totalQuestions: number
}

export function ResultsChart({ correctAnswers, totalQuestions }: ResultsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const percentage = Math.round((correctAnswers / totalQuestions) * 100)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const size = 200
    canvas.width = size
    canvas.height = size

    // Calculate center and radius
    const centerX = size / 2
    const centerY = size / 2
    const radius = 80
    const lineWidth = 16

    // Animation variables
    let currentPercentage = 0
    const targetPercentage = percentage
    const animationDuration = 1500 // ms
    const startTime = performance.now()

    // Colors
    const backgroundColor = "#f1f5f9" // slate-100
    const progressColor = percentage >= 60 ? "#22c55e" : percentage >= 40 ? "#eab308" : "#ef4444" // green-500, yellow-500, red-500
    const textColor = "#1e293b" // slate-800

    function animate(timestamp: number) {
      // Calculate progress
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / animationDuration, 1)
      currentPercentage = Math.floor(progress * targetPercentage)

      // Clear canvas
      ctx.clearRect(0, 0, size, size)

      // Draw background circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = backgroundColor
      ctx.lineWidth = lineWidth
      ctx.stroke()

      // Draw progress arc
      if (currentPercentage > 0) {
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * currentPercentage) / 100)
        ctx.strokeStyle = progressColor
        ctx.lineWidth = lineWidth
        ctx.stroke()
      }

      // Draw text
      ctx.fillStyle = textColor
      ctx.font = "bold 36px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`${currentPercentage}%`, centerX, centerY)

      // Continue animation if not complete
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [percentage])

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <canvas ref={canvasRef} width="200" height="200" />
        <div className="absolute bottom-0 w-full text-center">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
            <span className="font-medium text-green-700 dark:text-green-300">{correctAnswers}</span>
            <span className="mx-1 text-gray-600 dark:text-gray-400">von</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{totalQuestions}</span>
            <span className="ml-1 text-green-700 dark:text-green-300">✓</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
