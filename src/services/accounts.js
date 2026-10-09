import { readRecord, writeRecord } from './db.js'

const sessionKey = 'learnlingo:session'
const encoder = new TextEncoder()
const toHex = (bytes) => [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('')

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: Uint8Array.from(salt.match(/.{2}/g), (part) => parseInt(part, 16)), iterations: 120000, hash: 'SHA-256' }, key, 256)
  return toHex(new Uint8Array(bits))
}

const publicUser = ({ uid, name, email }) => ({ uid, displayName: name, email })

export async function registerAccount(name, email, password) {
  const normalizedEmail = email.trim().toLowerCase()
  if (await readRecord('users', normalizedEmail)) throw Object.assign(new Error('This email already has an account.'), { code: 'account-exists' })
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)))
  const record = { uid: crypto.randomUUID(), name: name.trim(), email: normalizedEmail, salt, passwordHash: await hashPassword(password, salt) }
  await writeRecord('users', record, 'add')
  localStorage.setItem(sessionKey, JSON.stringify({ uid: record.uid, email: record.email }))
  return publicUser(record)
}

export async function loginAccount(email, password) {
  const record = await readRecord('users', email.trim().toLowerCase())
  if (!record || record.passwordHash !== await hashPassword(password, record.salt)) throw Object.assign(new Error('Email or password is incorrect.'), { code: 'invalid-credentials' })
  localStorage.setItem(sessionKey, JSON.stringify({ uid: record.uid, email: record.email }))
  return publicUser(record)
}

export async function restoreAccount() {
  try {
    const session = JSON.parse(localStorage.getItem(sessionKey) || 'null')
    if (!session?.uid || !session?.email) return null
    const record = await readRecord('users', session.email)
    return record?.uid === session.uid ? publicUser(record) : null
  } catch {
    return null
  }
}

export function logoutAccount() {
  localStorage.removeItem(sessionKey)
}

export async function readFavoriteIds(uid) {
  const record = await readRecord('favorites', uid)
  return Array.isArray(record?.ids) ? record.ids.filter((id) => typeof id === 'string' && /^[\w-]+$/.test(id)) : []
}

export const writeFavoriteIds = (uid, ids) => writeRecord('favorites', { uid, ids })
