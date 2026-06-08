import { generateAIResponse } from '../lib/openrouter'

export async function generateFlashcards(topicName: string, notes: string) {
  const prompt = `
Generate 10 study flashcards.

Topic:
${topicName}

Notes:
${notes}

Return ONLY valid JSON.

Format:

[
  {
    "question": "Question here",
    "answer": "Answer here"
  }
]
`

  const response = await generateAIResponse(prompt)

  const cleanedResponse = response
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  return JSON.parse(cleanedResponse)
}
