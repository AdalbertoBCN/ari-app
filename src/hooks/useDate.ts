import { create } from "zustand"

interface DateStore {
    selectedDate: Date
    setSelectedDate: (date: Date) => void
}

export const useDate = create<DateStore>((set) => ({
    selectedDate: new Date(),
    setSelectedDate: (date) => set({ selectedDate: date })
}))