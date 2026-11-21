import { Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView, Text, View, Pressable } from 'react-native'
import { useStore } from '@/lib/useLibrary'
import { Track } from '@/lib/types'
import { Image } from 'expo-image'
import { Link } from 'expo-router'


export default function SearchPage() {

  const catalogProvider = useStore((state) => state.catalogProvider)
  const setLastSelectedTrack = useStore((state) => state.setLastSelectedTrack)

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

      <ScrollView contentContainerClassName="gap-3 p-4 pt-24">
        {tracksRes.map((t, i) => (
          <View key={i} className="w-full flex-row items-center gap-x-2">
            <Image
              source={{ uri: t.release.photo_path }}
              style={{ width: 50, height: 50, borderRadius: 4 }}
              contentFit="cover"
              transition={200}
            />
            <Link href={{ pathname: '/lyrics/[name]', params: { name: t.name } }} asChild>
              <Pressable onPress={() => setLastSelectedTrack(t)} className="flex-1">
                <Text
                  className="text-white font-sans text-lg w-full"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {t.name}
                </Text>
                <View className="flex flex-row gap-x-1">
                  {t.artists.map((a, i) => (
                    <Text key={a.name} className="text-white/50 font-sans">
                      {a.name}
                      {i < t.artists.length - 1 && ","}
                    </Text>
                  ))}
                </View>
              </Pressable>
            </Link>
          </View>
        ))}
      </ScrollView>

    </>
  )
}