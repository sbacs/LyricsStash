import { Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useStore } from '@/lib/useLibrary'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [tracks, setTracks] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const catalogProvider = useStore((state) => state.catalogProvider)

  useEffect(() => {
    const trimmed = query.trim()

    if (!trimmed) {
      setTracks([])
      setError(null)
      setLoading(false)
      return
    }

    let cancelled = false

    const timeout = setTimeout(async () => {
      try {
        setLoading(true)
        setError(null)

        const results = await catalogProvider.search(trimmed)
        console.log('query:', trimmed, 'results:', results.length)

        if (!cancelled) setTracks(results)
      } catch (e: any) {
        console.error('search failed', e)
        if (!cancelled) {
          setTracks([])
          setError(e?.message ?? 'Search failed')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [query, catalogProvider])

  return (
    <>
      <Stack.Title>Search</Stack.Title>

      <Stack.SearchBar
        placement="automatic"
        placeholder="Search"
        onChangeText={(e) => setQuery(e.nativeEvent.text)}
      />

      <ScrollView
        className="flex-1 bg-white dark:bg-black"
        contentInsetAdjustmentBehavior="automatic"
      >
        {loading && (
          <View className="p-3">
            <Text className="text-gray-500">Loading...</Text>
          </View>
        )}

        {error && (
          <View className="p-3">
            <Text className="text-red-500">{error}</Text>
          </View>
        )}

        {!loading && !error && query.trim() !== '' && tracks.length === 0 && (
          <View className="p-3">
            <Text className="text-gray-500">No results</Text>
          </View>
        )}

        {tracks.map((track, index) => (
          <View
            key={`${track}-${index}`}
            className="border-b border-gray-200 px-4 py-3 dark:border-gray-800"
          >
            <Text className="text-base text-black dark:text-white">
              {track}
            </Text>
          </View>
        ))}
      </ScrollView>
    </>
  )
}