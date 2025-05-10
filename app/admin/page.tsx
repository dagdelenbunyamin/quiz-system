"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Save, Trash2, Edit, AlertCircle } from "lucide-react"
import { AdminLogin } from "@/components/admin/AdminLogin"
import {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  type QuestionData,
} from "../actions/question-actions"
import { useToast } from "@/hooks/use-toast"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [questions, setQuestions] = useState<QuestionData[]>([])
  const [newQuestion, setNewQuestion] = useState<Omit<QuestionData, "id">>({
    question: "",
    options: ["", "", "", ""],
    correctOption: 0,
    category: "Allgemein",
  })
  const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(null)
  const { toast } = useToast()

  // Überprüfe, ob der Benutzer authentifiziert ist
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = sessionStorage.getItem("adminAuthenticated") === "true"
      setIsAuthenticated(isAuth)

      if (isAuth) {
        fetchQuestions()
      } else {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Lade Fragen aus der JSON-Datei
  const fetchQuestions = async () => {
    setIsLoading(true)
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
      setIsLoading(false)
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    if (editingQuestion) {
      const updatedOptions = [...editingQuestion.options]
      updatedOptions[index] = value
      setEditingQuestion({ ...editingQuestion, options: updatedOptions })
    } else {
      const updatedOptions = [...newQuestion.options]
      updatedOptions[index] = value
      setNewQuestion({ ...newQuestion, options: updatedOptions })
    }
  }

  const handleAddQuestion = async () => {
    const questionData = editingQuestion || newQuestion

    if (questionData.question.trim() === "" || questionData.options.some((opt) => opt.trim() === "")) {
      toast({
        title: "Fehler",
        description: "Bitte fülle alle Felder aus",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingQuestion) {
        // Aktualisiere bestehende Frage
        const result = await updateQuestion(editingQuestion)
        if (result.success) {
          toast({
            title: "Erfolg",
            description: "Frage wurde aktualisiert",
          })
          await fetchQuestions()
          setEditingQuestion(null)
        } else {
          toast({
            title: "Fehler",
            description: result.error || "Frage konnte nicht aktualisiert werden",
            variant: "destructive",
          })
        }
      } else {
        // Füge neue Frage hinzu
        const result = await addQuestion(newQuestion)
        if (result.success) {
          toast({
            title: "Erfolg",
            description: "Frage wurde hinzugefügt",
          })
          await fetchQuestions()
          setNewQuestion({
            question: "",
            options: ["", "", "", ""],
            correctOption: 0,
            category: "Allgemein",
          })
        } else {
          toast({
            title: "Fehler",
            description: result.error || "Frage konnte nicht hinzugefügt werden",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Fehler beim Verarbeiten der Frage:", error)
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
        variant: "destructive",
      })
    }
  }

  const handleEditQuestion = (question: QuestionData) => {
    setEditingQuestion(question)
  }

  const handleDeleteQuestion = async (id: number) => {
    if (confirm("Möchtest du diese Frage wirklich löschen?")) {
      try {
        const result = await deleteQuestion(id)
        if (result.success) {
          toast({
            title: "Erfolg",
            description: "Frage wurde gelöscht",
          })
          await fetchQuestions()
        } else {
          toast({
            title: "Fehler",
            description: result.error || "Frage konnte nicht gelöscht werden",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Fehler beim Löschen der Frage:", error)
        toast({
          title: "Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
          variant: "destructive",
        })
      }
    }
  }

  const categories = Array.from(new Set(questions.map((q) => q.category)))

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLogin={() => {
          setIsAuthenticated(true)
          fetchQuestions()
        }}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Lade Daten...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">Admin-Bereich</h1>

          <Tabs defaultValue="questions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="questions">Fragen verwalten</TabsTrigger>
              <TabsTrigger value="add">Frage hinzufügen</TabsTrigger>
            </TabsList>

            <TabsContent value="questions">
              <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                  Alle Fragen ({questions.length})
                </h2>

                {questions.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Keine Fragen gefunden</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Füge deine erste Frage im Tab "Frage hinzufügen" hinzu
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <Card className="p-4 border border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                                {question.category}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditQuestion(question)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Bearbeiten</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteQuestion(question.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Löschen</span>
                              </Button>
                            </div>
                          </div>

                          <h3 className="font-medium text-gray-800 dark:text-white mb-2">{question.question}</h3>

                          <div className="pl-4 text-sm text-gray-600 dark:text-gray-400">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs ${
                                    optIndex === question.correctOption
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIndex)}
                                </div>
                                <span className={optIndex === question.correctOption ? "font-medium" : ""}>
                                  {option}
                                </span>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="add">
              <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg">
                <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
                  {editingQuestion ? "Frage bearbeiten" : "Neue Frage hinzufügen"}
                </h2>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="question">Frage</Label>
                    <Textarea
                      id="question"
                      placeholder="Gib hier deine Frage ein..."
                      value={editingQuestion ? editingQuestion.question : newQuestion.question}
                      onChange={(e) =>
                        editingQuestion
                          ? setEditingQuestion({ ...editingQuestion, question: e.target.value })
                          : setNewQuestion({ ...newQuestion, question: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Kategorie</Label>
                    <Select
                      value={editingQuestion ? editingQuestion.category : newQuestion.category}
                      onValueChange={(value) =>
                        editingQuestion
                          ? setEditingQuestion({ ...editingQuestion, category: value })
                          : setNewQuestion({ ...newQuestion, category: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Wähle eine Kategorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...categories, "Neue Kategorie", "Allgemein"].map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {(editingQuestion?.category === "Neue Kategorie" || newQuestion.category === "Neue Kategorie") && (
                    <div>
                      <Label htmlFor="newCategory">Neue Kategorie</Label>
                      <Input
                        id="newCategory"
                        placeholder="Gib den Namen der neuen Kategorie ein"
                        onChange={(e) =>
                          editingQuestion
                            ? setEditingQuestion({ ...editingQuestion, category: e.target.value })
                            : setNewQuestion({ ...newQuestion, category: e.target.value })
                        }
                        className="mt-1"
                      />
                    </div>
                  )}

                  <div>
                    <Label>Antwortmöglichkeiten</Label>
                    <div className="space-y-3 mt-1">
                      {(editingQuestion ? editingQuestion.options : newQuestion.options).map((option, index) => (
                        <div key={index} className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 cursor-pointer ${
                              index === (editingQuestion ? editingQuestion.correctOption : newQuestion.correctOption)
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                            onClick={() =>
                              editingQuestion
                                ? setEditingQuestion({ ...editingQuestion, correctOption: index })
                                : setNewQuestion({ ...newQuestion, correctOption: index })
                            }
                          >
                            {String.fromCharCode(65 + index)}
                          </div>
                          <Input
                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Klicke auf den Buchstaben, um die richtige Antwort auszuwählen.
                    </p>
                  </div>

                  <div className="flex justify-between">
                    {editingQuestion && (
                      <Button variant="outline" onClick={() => setEditingQuestion(null)}>
                        Abbrechen
                      </Button>
                    )}
                    <div className={editingQuestion ? "" : "ml-auto"}>
                      <Button onClick={handleAddQuestion} className="bg-rose-600 hover:bg-rose-700 text-white">
                        {editingQuestion ? (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Änderungen speichern
                          </>
                        ) : (
                          <>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Frage hinzufügen
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
