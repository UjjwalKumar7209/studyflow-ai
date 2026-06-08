import { generateAIResponse } from '../lib/openrouter'

export async function generateNotes(topicName: string) {
  const prompt = `
Create detailed study notes.

Topic:

${topicName}

Requirements:

- Beginner friendly
- Proper headings
- Key concepts
- Important points
- Easy to revise

Return plain text.
`

  return generateAIResponse(prompt)
}
