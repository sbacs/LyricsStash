export type ReleaseType = "Album" | "EP" | "Single";

export interface Artist {
  id: string;
  name: string;
  photo_path: string;
}

export interface Release {
  id: string;
  name: string;
  photo_path: string;
  release_date: string;
  type: ReleaseType;
  artists: Artist[];
}

export interface Track {
  id: string;
  name: string;
  duration_s: number;
  artists: Artist[];
  release: Release;
}






interface LyricsWord {
  text: string;
  start_ms: number;
  end_ms: number;
}

interface LyricsLine {
  text: string;
  start_ms: number;
  end_ms: number;
  words?: LyricsWord[];
}
export interface Lyrics {
    lines: LyricsLine[],
    duration_ms?: number;
}









export interface CatalogProvider {
  search: (query: string) => Promise<Track[]>;
}

export interface LyricsProvider {
  getLyrics: (trackName: string, artistName: string) => Promise<Lyrics>;
}
