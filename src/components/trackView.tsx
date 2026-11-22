import { Track } from "@/lib/types";
import { useStore } from "@/lib/useLibrary";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

interface trackProps {
    track: Track;
}

export default function TrackView({ track }: trackProps) {

    const setLastSelectedTrack = useStore((state) => state.setLastSelectedTrack)

    return (
        <Link key={track.id} className="flex-1 flex flex-row gap-x-2 " href={{ pathname: '/lyrics/[name]', params: { name: track.name } }} asChild>
            <Pressable onPress={() => setLastSelectedTrack(track)} className="">
                <Image
                    source={{ uri: track.release.photo_path }}
                    style={{ width: 50, height: 50, borderRadius: 4 }}
                    contentFit="cover"
                    transition={200}
                />
                <View className="flex-1 flex justify-center ">
                    <Text
                        className="text-white font-sans text-lg "
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {track.name}
                    </Text>
                    <View className="flex flex-row gap-x-1">
                        {track.artists.map((a, i) => (
                            <Text key={a.name} className="text-white/50 font-sans">
                                {a.name}
                                {i < track.artists.length - 1 && ","}
                            </Text>
                        ))}
                    </View>
                </View>
            </Pressable>
        </Link>
    )
}