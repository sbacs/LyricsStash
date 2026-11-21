import { LyricsProvider } from "../types";
import YAML from "yaml";


export class lrclib implements LyricsProvider {
  baseUrl = "https://lrclib.net";

  async getLyrics(trackName: string, artistName: string) {

    const params = new URLSearchParams({
      track_name: trackName,
      artist_name: artistName
    });

    const response = await fetch(`${this.baseUrl}/api/get?${params}`);

    const data = await response.json()
    
    return YAML.parse(data.lyricsfile)
  }
}
