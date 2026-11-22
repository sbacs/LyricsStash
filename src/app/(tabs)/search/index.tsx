import { Track } from '@/lib/types'
import { useStore } from '@/lib/useLibrary'
import { Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import TrackView from '@/components/trackView'

export default function SearchPage() {

  const catalogProvider = useStore((state) => state.catalogProvider)

  const [query, setQuery] = useState('')
  const [tracksRes, setTracks] = useState<Track[]>([])

  useEffect(() => {


    const id = setTimeout(async () => {
      try {
        const tracks = await catalogProvider.search(query)
        setTracks(tracks)
      } catch (e) {
        console.error('search failed', e)
      }
    }, 300);

    return () => {
      clearTimeout(id)
    }

  }, [query])


  return (
    <>
      <Stack.Title>Search</Stack.Title>

      <Stack.SearchBar
        placement="automatic"
        placeholder="Search"
        onChangeText={(e) => setQuery(e.nativeEvent.text)}
      />

      <FlatList data={tracksRes} numColumns={1} contentContainerClassName='gap-y-2 p-4' keyExtractor={(t) => String(t.id)}
        renderItem={({item: t}) => (
          <TrackView track={t}  />
        )} />

    </>
  )
}