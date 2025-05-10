"use server"

import fs from "fs"
import path from "path"
import { revalidatePath } from "next/cache"

// Pfad zur JSON-Datei
const questionsFilePath = path.join(process.cwd(), "questions.json")

// Typ für Fragen
export type QuestionData = {
  id: number
  question: string
  options: string[]
  correctOption: number
  category: string
}

// Lesen der Fragen aus der JSON-Datei
export async function getQuestions(): Promise<QuestionData[]> {
  try {
    if (!fs.existsSync(questionsFilePath)) {
      throw new Error("Die Datei questions.json existiert nicht.")
    }

    const data = fs.readFileSync(questionsFilePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Fehler beim Lesen der Fragen:", error)
    return []
  }
}

// Speichern der Fragen in die JSON-Datei
export async function saveQuestions(questions: QuestionData[]) {
  try {
    fs.writeFileSync(questionsFilePath, JSON.stringify(questions, null, 2))
    revalidatePath("/admin")
    revalidatePath("/quiz")
    return { success: true }
  } catch (error) {
    console.error("Fehler beim Speichern der Fragen:", error)
    return { success: false, error: "Fehler beim Speichern der Fragen" }
  }
}

// Hinzufügen einer neuen Frage
export async function addQuestion(question: Omit<QuestionData, "id">) {
  try {
    const questions = await getQuestions()

    // Finde die höchste ID und erhöhe sie um 1
    const maxId = questions.reduce((max, q) => Math.max(max, q.id), 0)
    const newQuestion = { ...question, id: maxId + 1 }

    const updatedQuestions = [...questions, newQuestion]
    await saveQuestions(updatedQuestions)

    return { success: true, question: newQuestion }
  } catch (error) {
    console.error("Fehler beim Hinzufügen der Frage:", error)
    return { success: false, error: "Fehler beim Hinzufügen der Frage" }
  }
}

// Aktualisieren einer Frage
export async function updateQuestion(question: QuestionData) {
  try {
    const questions = await getQuestions()
    const index = questions.findIndex((q) => q.id === question.id)

    if (index === -1) {
      return { success: false, error: "Frage nicht gefunden" }
    }

    questions[index] = question
    await saveQuestions(questions)

    return { success: true }
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Frage:", error)
    return { success: false, error: "Fehler beim Aktualisieren der Frage" }
  }
}

// Löschen einer Frage
export async function deleteQuestion(id: number) {
  try {
    const questions = await getQuestions()
    const updatedQuestions = questions.filter((q) => q.id !== id)

    if (questions.length === updatedQuestions.length) {
      return { success: false, error: "Frage nicht gefunden" }
    }

    await saveQuestions(updatedQuestions)

    return { success: true }
  } catch (error) {
    console.error("Fehler beim Löschen der Frage:", error)
    return { success: false, error: "Fehler beim Löschen der Frage" }
  }
}

// Passwortüberprüfung für den Admin-Bereich
export async function verifyAdminPassword(password: string) {
  const correctPassword = process.env.ADMIN_PASSWORD || "admin"
  return password === correctPassword
}
