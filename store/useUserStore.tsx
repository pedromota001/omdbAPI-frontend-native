import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Movie = {
  objectId: string
  titulo: string
  posterUrl: string
  notaIMDB: string
}

type ListStore = {
  myList: Movie[]
  addMyList: (movie: Movie) => void
  removeMyList: (id: string) => void
  isMyList: (id: string) => boolean
}

export const useMyListStore = create<ListStore>()(
  persist(
    (set, get) => ({
      myList: [],
      addMyList: (movie) =>
        set((state) => ({
          myList: [...state.myList, movie],
        })),
      removeMyList: (id) =>
        set((state) => ({
          myList: state.myList.filter((m) => m.objectId !== id),
        })),
      isMyList: (id) => get().myList.some((m) => m.objectId === id),
    }),
    {
      name: 'mylist-movies',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name)
          return value ? JSON.parse(value) : null
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name)
        },
      },
    }
  )
)
