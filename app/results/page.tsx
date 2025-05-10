"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Home, RotateCcw } from "lucide-react"
import { ResultsChart } from "@/components/results/ResultsChart"
import { CategoryBreakdown } from "@/components/results/CategoryBreakdown"
import { getQuestions, type QuestionData } from "../actions/question-actions"
import { useToast } from "@/hooks/use-toast"

type Answer = {
  questionId: number
  selectedOption: number
  isCorrect: boolean
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [answers, setAnswers] = useState<Answer[]>([])
  const [questions, setQuestions] = useState<QuestionData[]>([])
  const [loading, setLoading] = useState(true)

  // Verwende useCallback, um zu verhindern, dass die Funktion bei jedem Rendering neu erstellt wird
  const fetchData = useCallback(async () => {
    try {
      // Lade Antworten aus der URL
      const answersParam = searchParams.get("answers")
      if (answersParam) {
        try {
          const parsedAnswers = JSON.parse(decodeURIComponent(answersParam))
          setAnswers(parsedAnswers)
        } catch (error) {
          console.error("Fehler beim Parsen der Antworten:", error)
        }
      }

      // Lade Fragen aus der JSON-Datei
      const fetchedQuestions = await getQuestions()
      setQuestions(fetchedQuestions)
    } catch (error) {
      console.error("Fehler beim Laden der Daten:", error)
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [searchParams, toast])

  // Führe fetchData nur einmal beim ersten Rendering aus
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Funktionen für die Navigation
  const handleGoHome = () => {
    router.push("/")
  }

  const handleRetryQuiz = () => {
    router.push("/quiz")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Lade Ergebnisse...</p>
        </div>
      </div>
    )
  }

  if (answers.length === 0 || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Keine Ergebnisse gefunden</h1>
          <Button onClick={handleRetryQuiz}>Zum Quiz zurückkehren</Button>
        </Card>
      </div>
    )
  }

  const correctAnswers = answers.filter((a) => a.isCorrect).length
  const totalQuestions = answers.length
  const percentage = Math.round((correctAnswers / totalQuestions) * 100)
  const secondsPerQuestion = Math.round((answers.length * 15) / totalQuestions)

  // Gruppiere Fragen nach Kategorie für die Aufschlüsselung
  const categories = questions.reduce(
    (acc, question) => {
      if (!acc[question.category]) {
        acc[question.category] = { total: 0, correct: 0 }
      }

      // Prüfe, ob diese Frage beantwortet wurde
      const answer = answers.find((a) => a.questionId === question.id)
      if (answer) {
        acc[question.category].total += 1
        if (answer.isCorrect) {
          acc[question.category].correct += 1
        }
      }

      return acc
    },
    {} as Record<string, { total: number; correct: number }>,
  )

  // Feedback basierend auf dem Prozentsatz
  const getFeedback = () => {
    if (percentage >= 90) return { emoji: "🏆", text: "Hervorragend! Du beherrschst dieses Thema perfekt!" }
    if (percentage >= 75) return { emoji: "🌟", text: "Sehr gut! Du hast ein solides Verständnis des Themas." }
    if (percentage >= 60) return { emoji: "👍", text: "Gut gemacht! Mit etwas mehr Übung wirst du noch besser." }
    if (percentage >= 40)
      return { emoji: "🔍", text: "Du bist auf dem richtigen Weg. Wiederhole die schwierigen Themen." }
    return { emoji: "📚", text: "Keine Sorge! Übung macht den Meister. Versuche es noch einmal." }
  }

  const feedback = getFeedback()

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="p-8 mb-8 bg-white dark:bg-gray-800 shadow-xl">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{feedback.emoji}</div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Quiz abgeschlossen!</h1>
                <p className="text-gray-600 dark:text-gray-300 text-xl">{feedback.text}</p>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="w-full md:w-1/2"
                >
                  <ResultsChart correctAnswers={correctAnswers} totalQuestions={totalQuestions} />
                </motion.div>

                <div className="w-full md:w-1/2">
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Deine Ergebnisse</h2>
                    <div className="space-y-4 text-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                          <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 dark:text-white">
                            {correctAnswers} von {totalQuestions} richtig
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Du hast {percentage}% der Fragen korrekt beantwortet
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                          <span className="text-blue-600 dark:text-blue-400 text-xl">⏱</span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 dark:text-white">
                            {Math.round(answers.length * 15)} Sekunden
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Durchschnittlich {secondsPerQuestion} Sekunden pro Frage
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Themenübersicht</h2>
                <CategoryBreakdown categories={categories} />
              </motion.div>
            </Card>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="w-full sm:w-auto" onClick={handleGoHome}>
              <Home className="mr-2 h-4 w-4" />
              Zur Startseite
            </Button>
            <Button className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700" onClick={handleRetryQuiz}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Quiz wiederholen
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
