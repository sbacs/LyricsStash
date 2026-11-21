import { ytMusicProvider } from "./catalogProviders/YoutTubeMusic";
import { lrclib } from "./lyricsProviders/lcrlib";
import { CatalogProvider, LyricsProvider } from "./types";

export const catalogProvider: CatalogProvider = new ytMusicProvider()
export const lyricsProvider: LyricsProvider = new lrclib(); 