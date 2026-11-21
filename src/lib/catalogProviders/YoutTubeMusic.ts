import { Innertube } from "youtubei.js";
import { CatalogProvider, Track } from "../types";


export class ytMusicProvider implements CatalogProvider {
  private yt: Promise<Innertube> | null = null;

  private getClient() {
    this.yt ??= Innertube.create({ retrieve_player: false });
    return this.yt;
  }

  async search(searchQuery: string): Promise<Track[]> {
    if (!searchQuery.trim()) return [];

    const yt = await this.getClient();
    const res = await yt.music.search(searchQuery, { type: "song" });

    const songs = res.songs?.contents ?? [];

    return songs.map((s: any) => {
      const artists = (s.artists ?? []).map((a: any) => ({
        id: a.channel_id ?? "",
        name: a.name ?? "",
      }));

      return {
        id: s.id ?? "",
        name: s.title ?? "",
        duration_s: s.duration?.seconds ?? 0,
        artists,
        release: {
          id: s.album?.id ?? "",
          name: s.album?.name ?? "",
          release_date: s.year ?? "", // often missing in search results
          type: "Album", // adapt to your union type
          artists,
          photo_path: s.thumbnails?.[1]?.url ?? s.thumbnails?.[0]?.url ?? "",
        },
      };
    });
  }
}
