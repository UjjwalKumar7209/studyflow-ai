import { generateAIResponse } from '../lib/openrouter'

export async function askDocument(content: string, question: string) {
  const prompt = `
You are a study assistant.

Answer ONLY from the provided document.

If the answer is not present,
say:

"I could not find this in the document."

Document:

${content}

Question:

${question}
`

  return generateAIResponse(prompt)
}
