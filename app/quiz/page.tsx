"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react"
import { MotivationalMessage } from "@/components/quiz/MotivationalMessage"
import { getQuestions, type QuestionData } from "../actions/question-actions"
import { useToast } from "@/hooks/use-toast"

export default function QuizPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [questions, setQuestions] = useState<QuestionData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answers, setAnswers] = useState<{ questionId: number; selectedOption: number; isCorrect: boolean }[]>([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [isAnswered, setIsAnswered] = useState(false)

  // Lade Fragen aus der JSON-Datei
  const fetchQuestions = useCallback(async () => {
    try {
      const fetchedQuestions = await getQuestions()
      setQuestions(fetchedQuestions)
    } catch (error) {
      console.error("Fehler beim Laden der Fragen:", error)
      toast({
        title: "Fehler",
        description: "Fragen konnten nicht geladen werden.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Führe fetchQuestions nur einmal beim ersten Rendering aus
  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (timeLeft > 0 && !isAnswered) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0 && !isAnswered) {
      handleNextQuestion()
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [timeLeft, isAnswered])

  useEffect(() => {
    setTimeLeft(30)
    setSelectedOption(null)
    setIsAnswered(false)
  }, [currentQuestionIndex])

  // Zeige Ladeanimation
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Lade Fragen...</p>
        </div>
      </div>
    )
  }

  // Zeige Nachricht, wenn keine Fragen vorhanden sind
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <h1 className="text-2xl font-bold mb-4">Keine Fragen verfügbar</h1>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Es wurden noch keine Fragen hinzugefügt. Bitte füge im Admin-Bereich Fragen hinzu.
          </p>
          <Button onClick={() => router.push("/admin")} className="w-full bg-rose-600 hover:bg-rose-700">
            Zum Admin-Bereich
          </Button>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = (currentQuestionIndex / questions.length) * 100

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return

    setSelectedOption(optionIndex)
    setIsAnswered(true)

    const isCorrect = optionIndex === currentQuestion.correctOption

    setAnswers([
      ...answers,
      {
        questionId: currentQuestion.id,
        selectedOption: optionIndex,
        isCorrect,
      },
    ])
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Navigiere zur Ergebnisseite mit den Antworten
      router.push(`/results?answers=${encodeURIComponent(JSON.stringify(answers))}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="mr-2 text-rose-600 dark:text-rose-400" />
              <span
                className={`font-bold ${timeLeft < 10 ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}`}
              >
                {timeLeft} Sekunden
              </span>
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              Frage {currentQuestionIndex + 1} von {questions.length}
            </div>
          </div>

          <Progress value={progress} className="h-2 mb-8" />

          <MotivationalMessage
            questionIndex={currentQuestionIndex}
            isAnswered={isAnswered}
            isCorrect={isAnswered && selectedOption === currentQuestion.correctOption}
          />

          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 mb-6 bg-white dark:bg-gray-800 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{currentQuestion.question}</h2>

              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left p-4 h-auto ${
                        selectedOption === index
                          ? index === currentQuestion.correctOption
                            ? "bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-500"
                            : "bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-500"
                          : "hover:bg-rose-50 dark:hover:bg-rose-900/20"
                      }`}
                      onClick={() => handleOptionSelect(index)}
                      disabled={isAnswered}
                    >
                      <div className="flex items-center">
                        <div className="mr-3">
                          {isAnswered && index === currentQuestion.correctOption && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {isAnswered && selectedOption === index && index !== currentQuestion.correctOption && (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          {(!isAnswered ||
                            (isAnswered && index !== selectedOption && index !== currentQuestion.correctOption)) && (
                            <div className="h-5 w-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                              {String.fromCharCode(65 + index)}
                            </div>
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-end"
            >
              <Button onClick={handleNextQuestion} className="bg-rose-600 hover:bg-rose-700 text-white">
                {currentQuestionIndex < questions.length - 1 ? "Nächste Frage" : "Ergebnisse anzeigen"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
