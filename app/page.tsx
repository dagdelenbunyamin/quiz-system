"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, BookOpen, Brain, Trophy } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-rose-600 dark:text-rose-400 mb-6">
            Lern<span className="text-gray-800 dark:text-white">Quest</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Ein modernes Quiz-System für Schulen, das Lernen zum Vergnügen macht
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mt-12"
        >
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Beginne deine Lernreise</h2>
              <ul className="space-y-4 mb-8">
                {[
                  {
                    icon: <Brain className="text-rose-500" />,
                    text: "Interaktive Fragen mit mehreren Antwortmöglichkeiten",
                  },
                  { icon: <Trophy className="text-rose-500" />, text: "Detaillierte Auswertung deiner Ergebnisse" },
                  {
                    icon: <BookOpen className="text-rose-500" />,
                    text: "Motivierende Elemente für ein stressfreies Lernen",
                  },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                    className="flex items-start"
                  >
                    <div className="mr-3 mt-1">{item.icon}</div>
                    <span className="text-gray-600 dark:text-gray-300">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
              <Link href="/quiz">
                <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white">
                  Quiz starten <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <div className="mt-4">
                <Link
                  href="/admin"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400"
                >
                  Admin-Bereich
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-rose-400 to-rose-600 p-8 md:p-12 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-white text-center"
              >
                <div className="text-6xl mb-4">🧠</div>
                <h3 className="text-2xl font-bold mb-2">Lerne mit Spaß</h3>
                <p className="opacity-90">
                  Unsere interaktiven Quizze machen das Lernen zum Vergnügen und helfen dir, dich besser auf
                  Klassenarbeiten vorzubereiten.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
