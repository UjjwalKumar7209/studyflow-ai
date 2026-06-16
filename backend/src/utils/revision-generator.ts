import { generateAIResponse } from '../lib/openrouter'

export async function generateRevision(topicName: string, notes: string) {
  const prompt = `
Create a concise revision guide.

Topic:
${topicName}

Notes:
${notes}

Requirements:

- Focus on revision
- Key points only
- Exam oriented
- Important concepts
- Easy to revise quickly

Return plain text.
`

  const response = await generateAIResponse(prompt)
  return response
}
