import { eq } from 'drizzle-orm'
import { db } from '../db'
import { metricsTable } from '../db/schema'

async function incrementMetric(key: string) {
  const existing = await db
    .select()
    .from(metricsTable)
    .where(eq(metricsTable.key, key))

  if (existing.length === 0) {
    await db.insert(metricsTable).values({
      key,
      value: 1
    })

    return
  }

  await db
    .update(metricsTable)
    .set({
      // @ts-ignore
      value: existing[0].value + 1
    })
    .where(eq(metricsTable.key, key))
}

async function getMetrics() {
  return db.select().from(metricsTable)
}

export default {
  incrementMetric,
  getMetrics
}
