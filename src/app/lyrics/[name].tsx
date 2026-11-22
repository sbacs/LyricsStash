import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '@/lib/useLibrary';
import { pastelFromCover } from '@/lib/colorPicker';
import { Lyrics } from '@/lib/types';
import { Link } from 'expo-router';

export default function LyricsPage() {

  const DEFAULT_BG = '#d9c9a3'; // sand fallback, outside the component

  // inside LyricsPage
  const [bg, setBg] = useState(DEFAULT_BG);


  const { name } = useLocalSearchParams<{ name: string }>();
  const [lyrics, setLyrics] = useState<Lyrics | null>();

  const lyricsProvider = useStore((state) => state.lyricsProvider);
  const lastSelectedTrack = useStore((state) => state.lastSelectedTrack);
  const coverUrl = lastSelectedTrack?.release.photo_path // adjust to your type

  const [selectedLyrics, setSelectedLyrics] = useState<number[]>([])


  useEffect(() => {
    if (!coverUrl) {
      setBg(DEFAULT_BG);
      return;
    }
    let cancelled = false;
    pastelFromCover(coverUrl)
      .then((c) => { if (!cancelled) setBg(c); })
      .catch(() => { if (!cancelled) setBg(DEFAULT_BG); });
    return () => { cancelled = true; };
  }, [coverUrl]);

  useEffect(() => {
    let cancelled = false;

    async function load() {

      if (!lastSelectedTrack) return null
      try {
        const result = await lyricsProvider.getLyrics(lastSelectedTrack.name, lastSelectedTrack.artists[0].name);
        if (!cancelled) setLyrics(result);
      } catch {
        if (!cancelled) setLyrics(null);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [name]);

  if (lyrics === undefined) return (
    <View className='flex flex-1 items-center justify-center'>
      <Text className="text-white text-xl">Loading</Text>
    </View>
  )

  if (lyrics === null) return (
    <View className='flex flex-1 items-center justify-center'>
      <Text className="text-white text-xl">No Lyrics Found</Text>
    </View>
  )

  return (
    <View className="flex-1 py-10 px-5 flex flex-col justify-center items-center" style={{ backgroundColor: bg }}>

      <View className='flex flex-col h-[90%] w-full items-center gap-y-5  '>
        <Text className='text-white font-bold '>{lastSelectedTrack?.name}</Text>

        <View className="flex-1 flex items-center">

          <ScrollView contentContainerClassName=" gap-2" showsVerticalScrollIndicator={false}>
            {lyrics.lines.map((l, i) => (
              <Pressable onPress={() =>
                setSelectedLyrics(prev => {
                  if (prev.length === 0) return [i];
                  const min = Math.min(...prev);
                  const max = Math.max(...prev);
                  return i === min - 1 || i === max + 1 ? [...prev, i] : [i];
                })
              } key={i} className={`${selectedLyrics.includes(i) ? "bg-black" : ""} ${i === Math.min(...selectedLyrics) - 1 || i === Math.max(...selectedLyrics) + 1 ? "bg-black/25" : ""} rounded-2xl p-4`}><Text className={`text-2xl font-bold `} style={selectedLyrics.includes(i) ? { color: bg } : undefined}>{l.text}</Text></Pressable>
            ))}
          </ScrollView>

          <LinearGradient
            pointerEvents="none"
            colors={[bg, bg + '00']}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80 }}
          />
          <LinearGradient
            pointerEvents="none"
            colors={[bg + '00', bg]}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 }}
          />

        </View>


        <Link href="/lyrics/add" asChild>
          <Pressable className="bg-white h-14 w-40 rounded-full items-center justify-center">
            <Text className="text-black font-bold">Continua</Text>
          </Pressable>
        </Link>
      </View>

    </View>
  );
}