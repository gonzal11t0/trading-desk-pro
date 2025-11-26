import { useState, useEffect } from 'react'

export function useConfig() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/config.json')
      .then(response => response.json())
      .then(data => {
        setConfig(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading config:', error)
        setLoading(false)
      })
  }, [])

  return { config, loading }
}