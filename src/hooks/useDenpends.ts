import { Dependents } from "@/lib/types"
import { create } from "zustand"

interface UseDependsStore {
    user: Dependents
    allDependents: Dependents[]
    filteredDependents: Dependents[]
    setDependents: (dependent: Dependents, token:string|undefined) => void
    addDependent: (dependent: Dependents) => void
    removeDependent: (id: number) => void
    removeAllDependents: () => void
    addAllDependents: () => void
    onlyUser: () => void
}

export const useDepends = create<UseDependsStore>((set) => ({
    user: {
        id: 0,
        name: "",
        email: "",
    },
    allDependents: [],
    filteredDependents: [],
    setDependents: async (dependent, token) => {
        const { responsibles } = await fetch(`http://localhost:3333/responsible/${dependent.id}`,{
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        }).then((res) => res.json())
        set({ allDependents: [dependent, ...responsibles] });
        set({ filteredDependents: [dependent] });
        set({ user: dependent });
    },
    addDependent: (dependent) => set((state) => ({ filteredDependents: [...state.filteredDependents, dependent] })),
    removeDependent: (id) => set((state) => ({ filteredDependents: state.filteredDependents.filter((dependent) => dependent.id !== id) })),
    removeAllDependents: () => set({ filteredDependents: [] }),
    addAllDependents: () => set((state) => ({ filteredDependents: state.allDependents })),
    onlyUser: () => set((state) => ({ filteredDependents: [state.user] })),
}))