import { useCallback, useEffect, useRef, useState } from 'react'
import { getMatchingTeachers } from '../services/teachers.js'

export function useTeachers(filters) {
  const [teachers, setTeachers] = useState([])
  const [cursor, setCursor] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const requestId = useRef(0)
  const busy = useRef(false)
  const filterKey = JSON.stringify(filters)

  const load = useCallback(async (reset = false) => {
    if (busy.current && !reset) return
    busy.current = true
    const currentRequest = ++requestId.current
    setLoading(true)
    setError('')
    if (reset) {
      setTeachers([])
      setCursor(null)
      setHasMore(true)
    }
    try {
      const page = await getMatchingTeachers(filters, reset ? null : cursor)
      if (requestId.current !== currentRequest) return
      setTeachers((current) => reset ? page.teachers : [...current, ...page.teachers])
      setCursor(page.cursor)
      setHasMore(page.hasMore)
    } catch {
      if (requestId.current === currentRequest) setError('Teachers could not be loaded. Please try again.')
    } finally {
      if (requestId.current === currentRequest) {
        setLoading(false)
        busy.current = false
      }
    }
  }, [filterKey, cursor])

  useEffect(() => {
    load(true)
    return () => { requestId.current += 1; busy.current = false }
  }, [filterKey])

  return { teachers, hasMore, loading, error, loadMore: () => load(false), retry: () => load(true) }
}
