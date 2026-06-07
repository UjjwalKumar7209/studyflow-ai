import { generateAIResponse } from '../lib/openrouter'

export async function extractTopics(content: string) {
  const prompt = `
You are an expert educator.

Extract all major study topics.

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT use \`\`\`json.

Output example:

[
  "Introduction to DBMS",
  "Normalization",
  "Transactions"
]

Content:

${content}
`

  const response = await generateAIResponse(prompt)
  const cleanedResponse = response
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  return JSON.parse(cleanedResponse)
}
