import localTeachers from '../data/teachers.json'
import { matchesFilters } from '../utils/teachers.js'
import { readTeacherBatch, readTeachersByIds } from './db.js'

export const languages = [...new Set(localTeachers.flatMap((teacher) => teacher.languages))].sort()
export const levels = [...new Set(localTeachers.flatMap((teacher) => teacher.levels))]

export async function getMatchingTeachers(filters, cursor, count = 4) {
  const matches = []
  let nextCursor = cursor
  let exhausted = false

  while (matches.length < count && !exhausted) {
    const batch = await readTeacherBatch(nextCursor)
    let processed = 0
    for (const teacher of batch.records) {
      processed += 1
      nextCursor = teacher.id
      if (matchesFilters(teacher, filters)) matches.push(teacher)
      if (matches.length === count) break
    }
    exhausted = (batch.exhausted && processed === batch.records.length) || batch.records.length === 0
  }

  return { teachers: matches, cursor: nextCursor, hasMore: !exhausted }
}

export const getTeachersByIds = readTeachersByIds
