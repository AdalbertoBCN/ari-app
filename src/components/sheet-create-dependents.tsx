"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { getLoginToken } from "@/actions/cookiesActions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { User } from "@/lib/types"
import { userIsLoged } from "@/actions/userActions"
import { useDepends } from "@/hooks/useDenpends"
import { useUser } from "@/hooks/useUser"

// Schema for dependent creation
const DependentSchema = z.object({
    userId: z.number().min(1, { message: "Escolha um usuário" }),
})

type DependentType = z.infer<typeof DependentSchema>

interface SheetDependentProps {
    children: React.ReactNode
}

export function SheetDependent({ children }: SheetDependentProps) {
    const user = useUser()
    const { setDependents } = useDepends();

    const { handleSubmit, formState: { errors }, setValue, reset } = useForm<DependentType>({
        resolver: zodResolver(DependentSchema),
    })

    const [availableUsers, setAvailableUsers] = useState<User[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const { toast } = useToast()
    const { refresh } = useRouter()

    useEffect(() => {
        (async () => {
            const { id, token } = await userIsLoged()

            // Fetch all users
            const { users } = await fetch("http://localhost:3333/users", {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.json())

            // Fetch current dependents
            const { responsibles } = await fetch(`http://localhost:3333/responsible/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.json())

            // Filter out users who are already dependents and the current user
            const dependentIds = new Set([id, ...responsibles.map((dep: User) => dep.id)])
            const filteredUsers = users.filter((user: User) => !dependentIds.has(user.id))

            setAvailableUsers(filteredUsers)
        })()
    }, [])

    const onSubmit = async (data: DependentType) => {
        try {
            const { id: responsibleId } = await userIsLoged()
            const token = await getLoginToken()
            
            const response = await fetch("http://localhost:3333/responsible", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    patientId: data.userId,
                    userId: responsibleId,
                }),
            })

            if (response.ok) {
                toast({ title: "Dependente adicionado com sucesso!" })
                refresh()
                setIsOpen(false)
                setDependents(user, token);
                reset()
            } else {
                toast({ title: "Erro ao adicionar dependente", variant: "destructive" })
            }
        } catch (error) {
            toast({ title: "Erro no servidor", variant: "destructive" })
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Adicionar Dependente</SheetTitle>
                    <SheetDescription>
                        Selecione um usuário para adicionar como seu dependente.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                    {/* Select para Usuário */}
                    <div className="space-y-2">
                        <Label>Usuário</Label>
                        <Select onValueChange={(value) => setValue("userId", parseInt(value))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um usuário" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableUsers.map((user) => (
                                    <SelectItem key={user.id} value={String(user.id)}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.userId && <p className="text-sm text-red-500">{errors.userId.message}</p>}
                    </div>

                    <SheetFooter>
                        <SheetClose asChild>
                            <Button variant="outline" onClick={() => setIsOpen(false)}>
                                Cancelar
                            </Button>
                        </SheetClose>
                        <Button type="submit">Adicionar</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}