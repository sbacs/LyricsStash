import { ytMusicProvider } from "./providers/YoutTubeMusic";
import { CatalogProvider } from "./types";

export const provider: CatalogProvider = new ytMusicProvider()