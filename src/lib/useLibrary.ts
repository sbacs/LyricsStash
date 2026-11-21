import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { catalogProvider, lyricsProvider } from './providers';
import { CatalogProvider, LyricsProvider, Track } from './types';

interface Store {
    id: string;
    catalogProvider: CatalogProvider;
    lyricsProvider: LyricsProvider;
    lastSelectedTrack: Track | null;

    setLastSelectedTrack: (t: Track) => void;
}

export const useStore = create<Store>()(
    persist(
        (set) => ({
            id: "9",
            catalogProvider: catalogProvider,
            lyricsProvider: lyricsProvider,
            lastSelectedTrack: null,
            setLastSelectedTrack: (t) => set({lastSelectedTrack: t})
        }), 
        {
            name: "store", storage: createJSONStorage(() => AsyncStorage),
            partialize: (s) => ({id: s.id})
        }
    )
)