import sourceTeachers from '../data/teachers.json'

let connection

export function openDatabase() {
  if (connection) return connection
  connection = new Promise((resolve, reject) => {
    const request = indexedDB.open('learnlingo', 1)
    request.onupgradeneeded = () => {
      const db = request.result
      const teachers = db.createObjectStore('teachers', { keyPath: 'id' })
      db.createObjectStore('users', { keyPath: 'email' })
      db.createObjectStore('favorites', { keyPath: 'uid' })
      db.createObjectStore('bookings', { keyPath: 'id', autoIncrement: true })
      sourceTeachers.forEach((teacher, index) => teachers.put({ ...teacher, id: String(index).padStart(3, '0') }))
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  return connection
}

export async function readRecord(storeName, key) {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName, 'readonly').objectStore(storeName).get(key)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function writeRecord(storeName, value, method = 'put') {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName, 'readwrite').objectStore(storeName)[method](value)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function readTeacherBatch(cursor, count = 8) {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const teachers = []
    const range = cursor === null ? undefined : IDBKeyRange.lowerBound(cursor, true)
    const request = db.transaction('teachers', 'readonly').objectStore('teachers').openCursor(range)
    request.onsuccess = () => {
      const item = request.result
      if (!item || teachers.length > count) {
        resolve({ records: teachers.slice(0, count), exhausted: teachers.length <= count })
        return
      }
      teachers.push(item.value)
      item.continue()
    }
    request.onerror = () => reject(request.error)
  })
}

export async function readTeachersByIds(ids) {
  return Promise.all(ids.map((id) => readRecord('teachers', id))).then((records) => records.filter(Boolean))
}
