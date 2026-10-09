import assert from 'node:assert/strict'
import test from 'node:test'
import { matchesFilters } from './teachers.js'

const teacher = {
  languages: ['English', 'Spanish'],
  levels: ['A1 Beginner', 'B1 Intermediate'],
  price_per_hour: 30,
}

test('filters combine language, level, and maximum price', () => {
  assert.equal(matchesFilters(teacher, { language: 'Spanish', level: 'B1 Intermediate', price: '30' }), true)
  assert.equal(matchesFilters(teacher, { language: 'French', level: '', price: '' }), false)
  assert.equal(matchesFilters(teacher, { language: '', level: 'C2 Proficient', price: '' }), false)
  assert.equal(matchesFilters(teacher, { language: '', level: '', price: '25' }), false)
})
