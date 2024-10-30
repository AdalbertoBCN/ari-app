"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { useRef } from "react"

const MedicineSchema = z.object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    dosage: z.coerce.number({message: "A dosagem deve ser um número"}).min(1, { message: "Dosagem é obrigatória" }),
    useCase: z.string().min(1, { message: "Caso de uso é obrigatório" }),
})

type MedicineType = z.infer<typeof MedicineSchema>

interface SheetMedicineProps {
    children: React.ReactNode
}

export function SheetMedicine({ children }: SheetMedicineProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<MedicineType>({
        resolver: zodResolver(MedicineSchema),
    })

    const { toast } = useToast()
    const { refresh } = useRouter()
    const sheetRef = useRef<HTMLDivElement>(null)

    const onSubmit = async (data: MedicineType) => {
        const token = await getLoginToken();

        try {
                const response = await fetch("http://localhost:3333/medicines", {
                        method: "POST",
                        headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                                name: data.name,
                                dosage: String(data.dosage),
                                useCase: data.useCase,
                        }),
                })

                console.log(response.statusText)

                if (response.ok) {
                        toast({
                                title: "Medicamento criado",
                                description: "Medicamento criado com sucesso",
                                variant: "success",
                        })
                        refresh()
                        if (sheetRef.current) {
                            sheetRef.current.click()
                        }
                } else {
                        toast({
                                title: "Erro ao criar medicamento",
                                description: "Ocorreu um erro ao criar o medicamento, tente novamente",
                                variant: "destructive",
                        })
                }
        } catch {
                toast({
                        title: "Erro ao criar medicamento",
                        description: "Ocorreu um erro ao criar o medicamento, tente novamente",
                        variant: "destructive",
                })
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Criar Medicamento</SheetTitle>
                    <SheetDescription>
                        Preencha os campos abaixo para criar um novo medicamento.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" {...register("name")} />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dosage">
                            Dosagem <span className="text-sm text-muted-foreground">(mg)</span>
                        </Label>
                        <Input id="dosage" {...register("dosage")} />
                        {errors.dosage && (
                            <p className="text-sm text-destructive">{errors.dosage.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="useCase">Uso</Label>
                        <Input id="useCase" {...register("useCase")} />
                        {errors.useCase && (
                            <p className="text-sm text-destructive">{errors.useCase.message}</p>
                        )}
                    </div>

                    <SheetFooter>
                        <SheetClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </SheetClose>
                        <Button type="submit">Criar</Button>
                    </SheetFooter>
                </form>
                <SheetClose asChild>
                    <div ref={sheetRef} style={{ display: 'none' }} />
                </SheetClose>
            </SheetContent>
        </Sheet>
    )
}