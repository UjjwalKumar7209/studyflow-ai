import { generateAIResponse } from '../lib/openrouter'

export async function generateQuiz(topicName: string, notes: string) {
  const prompt = `
Generate 10 MCQ questions.

Topic:
${topicName}

Notes:
${notes}

Return ONLY JSON.

Format:

[
 {
  "question":"...",
  "options":[
   "...",
   "...",
   "...",
   "..."
  ],
  "correctAnswer":"..."
 }
]
`

  const response = await generateAIResponse(prompt)

  const cleaned = response
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  return JSON.parse(cleaned)
}
