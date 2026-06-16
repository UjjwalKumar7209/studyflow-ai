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

  console.debug(
    `askDocument contentLength=${content?.length ?? 0} question=${question}`
  )

  const response = await generateAIResponse(prompt)

  try {
    console.debug(
      `askDocument got response preview=${(response || '').slice(0, 200)}`
    )
  } catch (e) {
    console.debug('askDocument response logging failed', e)
  }

  const notFoundPhrase = 'I could not find this in the document.'

  if (!response || response.trim().includes(notFoundPhrase)) {
    console.debug(
      'askDocument: primary response indicates not found, trying chunked search'
    )

    const chunkSize = 4000
    for (let i = 0; i < content.length; i += chunkSize) {
      const chunk = content.slice(i, i + chunkSize)

      const chunkPrompt = `\nYou are a study assistant.\n\nAnswer ONLY from the provided document chunk.\n\nIf the answer is not present in this chunk, say:\n\n"I could not find this in the document."\n\nDocument Chunk:\n\n${chunk}\n\nQuestion:\n\n${question}\n`

      try {
        const chunkResp = await generateAIResponse(chunkPrompt)

        const preview = (chunkResp || '').slice(0, 200)
        console.debug(`askDocument chunk ${i / chunkSize} preview=${preview}`)

        if (
          !chunkResp ||
          chunkResp.trim().includes(notFoundPhrase)
        ) {
          continue
        }

        return chunkResp
      } catch (e) {
        console.debug('askDocument chunk query failed', e)
        continue
      }
    }

    return notFoundPhrase
  }

  return response
}
