"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lightbulb, ThumbsUp, AlertCircle } from "lucide-react"

type MotivationalMessageProps = {
  questionIndex: number
  isAnswered: boolean
  isCorrect?: boolean
}

export function MotivationalMessage({ questionIndex, isAnswered, isCorrect }: MotivationalMessageProps) {
  const [message, setMessage] = useState("")

  const motivationalMessages = [
    { emoji: "💪", text: "Du schaffst das! Konzentriere dich auf die Frage." },
    { emoji: "🧠", text: "Nutze dein Wissen und vertraue auf deine Fähigkeiten." },
    { emoji: "🌟", text: "Jede Frage ist eine Chance, etwas zu lernen." },
    { emoji: "🚀", text: "Du machst das großartig! Weiter so!" },
    { emoji: "🔍", text: "Lies die Frage sorgfältig und überlege in Ruhe." },
  ]

  const correctMessages = [
    { emoji: "🎉", text: "Hervorragend! Das ist die richtige Antwort!" },
    { emoji: "✨", text: "Fantastisch! Du hast es richtig gemacht!" },
    { emoji: "👏", text: "Bravo! Dein Wissen zahlt sich aus!" },
    { emoji: "🏆", text: "Perfekt! Weiter so mit dieser Leistung!" },
    { emoji: "🌟", text: "Ausgezeichnet! Du beherrschst dieses Thema!" },
  ]

  const incorrectMessages = [
    { emoji: "📚", text: "Keine Sorge, aus Fehlern lernt man am meisten!" },
    { emoji: "🔄", text: "Beim nächsten Mal klappt es bestimmt!" },
    { emoji: "💡", text: "Jetzt weißt du, was die richtige Antwort ist!" },
    { emoji: "🌱", text: "Jeder Fehler ist eine Chance zum Wachsen!" },
    { emoji: "🤔", text: "Denk darüber nach, warum diese Antwort richtig ist." },
  ]

  useEffect(() => {
    if (!isAnswered) {
      // Show motivational message when question changes
      const randomIndex = Math.floor(Math.random() * motivationalMessages.length)
      setMessage(motivationalMessages[randomIndex].emoji + " " + motivationalMessages[randomIndex].text)
    } else {
      // Show feedback based on correctness
      const messages = isCorrect ? correctMessages : incorrectMessages
      const randomIndex = Math.floor(Math.random() * messages.length)
      setMessage(messages[randomIndex].emoji + " " + messages[randomIndex].text)
    }
  }, [questionIndex, isAnswered, isCorrect])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={message}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Alert
          className={`border ${
            !isAnswered
              ? "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20"
              : isCorrect
                ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20"
                : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/20"
          }`}
        >
          {!isAnswered && <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
          {isAnswered && isCorrect && <ThumbsUp className="h-4 w-4 text-green-600 dark:text-green-400" />}
          {isAnswered && !isCorrect && <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
          <AlertDescription className="ml-2">{message}</AlertDescription>
        </Alert>
      </motion.div>
    </AnimatePresence>
  )
}
