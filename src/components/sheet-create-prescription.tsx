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
import { Dependents, Medicine } from "@/lib/types"
import { userIsLoged } from "@/actions/userActions"

// Esquema de validação para Prescription
const PrescriptionSchema = z.object({
    userId: z.number().min(1, { message: "Escolha um dependente" }),
    medicineId: z.number().min(1, { message: "Escolha um medicamento" }),
    frequencyHours: z.number({ 
        message: "Frequência deve ser um número"
    }).min(1, { message: "Frequência deve ser maior que 0" }),
    notes: z.string().optional(),
    startDate: z.date({ message: "Data de início é obrigatória", required_error: "Data de início é obrigatória" }),
    endDate: z.date({ message: "Data de término é obrigatória", required_error: "Data de término é obrigatória" }),
}).refine(data => data.startDate < data.endDate, { message: "Data de início deve ser anterior à data de término" })

type PrescriptionType = z.infer<typeof PrescriptionSchema>

interface SheetPrescriptionProps {
    children: React.ReactNode
}

export function SheetPrescription({ children }: SheetPrescriptionProps) {
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<PrescriptionType>({
        resolver: zodResolver(PrescriptionSchema),
        defaultValues: {
            frequencyHours: 1, // Valor padrão para frequencyHours
        },
    })

    const [dependents, setDependents] = useState<Dependents[]>([])
    const [medicines, setMedicines] = useState<Medicine[]>([])
    const [isOpen, setIsOpen] = useState(false) // Estado para controlar o Sheet
    const { toast } = useToast()
    const { refresh } = useRouter()

    useEffect(() => {
        (async () => {
            const { id, token } = await userIsLoged()

            const { user } = await fetch(`http://localhost:3333/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.json())

            const { responsibles } = await fetch(`http://localhost:3333/responsible/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.json())

            setDependents([user, ...responsibles])

            const { medicines } = await fetch("http://localhost:3333/medicines", {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.json())
            setMedicines(medicines)
        })()
    }, [])

    const onSubmit = async (data: PrescriptionType) => {
        try {
            const token = await getLoginToken()
            const response = await fetch("http://localhost:3333/prescriptions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...data,
                    frequencyHours: Number(data.frequencyHours), // Garantir que frequencyHours seja um número
                }),
            })

            if (response.ok) {
                toast({ title: "Prescrição criada com sucesso!" })
                refresh()
                setIsOpen(false) // Fecha o Sheet
                reset() // Reseta o formulário
            } else {
                toast({ title: "Erro ao criar prescrição", variant: "destructive" })
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
                    <SheetTitle>Criar Prescrição</SheetTitle>
                    <SheetDescription>
                        Preencha os campos abaixo para criar uma nova prescrição.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                    {/* Select para Dependente */}
                    <div className="space-y-2">
                        <Label>Usuário</Label>
                        <Select onValueChange={(value) => setValue("userId", parseInt(value))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um usuário" />
                            </SelectTrigger>
                            <SelectContent>
                                {dependents.map((dependent) => (
                                    <SelectItem key={dependent.id} value={String(dependent.id)}>
                                        {dependent.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.userId && <p className="text-sm text-red-500">{errors.userId.message}</p>}
                    </div>

                    {/* Select para Medicamento */}
                    <div className="space-y-2">
                        <Label>Medicamento</Label>
                        <Select onValueChange={(value) => setValue("medicineId", parseInt(value))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um medicamento" />
                            </SelectTrigger>
                            <SelectContent>
                                {medicines.map((medicine) => (
                                    <SelectItem key={medicine.id} value={String(medicine.id)}>
                                        {medicine.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.medicineId && <p className="text-sm text-red-500">{errors.medicineId.message}</p>}
                    </div>

                    {/* Input para Frequência */}
                    <div className="space-y-2">
                        <Label htmlFor="frequencyHours">Frequência (Horas)</Label>
                        <Input
                            id="frequencyHours"
                            {...register("frequencyHours", { valueAsNumber: true })}
                        />
                        {errors.frequencyHours && (
                            <p className="text-sm text-red-500">{errors.frequencyHours.message}</p>
                        )}
                    </div>

                    {/* Input para Notas */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notas</Label>
                        <Input id="notes" {...register("notes")} />
                    </div>

                    {/* Data de Início e Término */}
                    <div className="space-y-2">
                        <Label htmlFor="startDate">Data de Início</Label>
                        <Input id="startDate" type="date" {...register("startDate", { valueAsDate: true })} />
                        {errors.startDate && (
                            <p className="text-sm text-red-500">{errors.startDate.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="endDate">Data de Término</Label>
                        <Input id="endDate" type="date" {...register("endDate", { valueAsDate: true })} />
                        {errors.endDate && (
                            <p className="text-sm text-red-500">{errors.endDate.message}</p>
                        )}
                    </div>

                    <SheetFooter>
                        <SheetClose asChild>
                            <Button variant="outline" onClick={() => setIsOpen(false)}>
                                Cancelar
                            </Button>
                        </SheetClose>
                        <Button type="submit">Criar</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
