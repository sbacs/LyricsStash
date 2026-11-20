import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { provider } from './provider';
import { CatalogProvider } from './types';

interface Store {
    id: string;
    catalogProvider: CatalogProvider;
}

export const useStore = create<Store>()(
    persist(
        (set) => ({
            id: "9",
            catalogProvider: provider
        }),
        {
            name: "store", storage: createJSONStorage(() => AsyncStorage),
            partialize: (s) => ({id: s.id})
        }
    )
)