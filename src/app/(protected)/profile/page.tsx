'use client'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import { useUser } from '@/hooks/useUser'
import { userIsLoged } from '@/actions/userActions'
import Image from 'next/image'

export default function PaginaPerfil() {
    const user = useUser();
    const [name, setName] = useState(user.name )
    const [email, setEmail] = useState(user.email)
    const [birthDate, setBirthDate] = useState(user.birthDate || "")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        const { id, token } = await userIsLoged()

        await fetch(`http://localhost:3333/users`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                patientId: id,
                name,
                email,
                birthDate,
            })
        })
        console.log({name, email, birthDate})
    }

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setBirthDate(user.birthDate || "");
        }
    }, [user]);

    return (
        <div className="flex justify-center items-center w-full">
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-col items-center">
                    <Image src="profile.svg" alt="user" width={100} height={100} />
                    <CardTitle>Editar Perfil</CardTitle>
                    <CardDescription>Atualize suas informações</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                id="name"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="birthDate">
                                Data de Nascimento
                            </Label>
                            <Input
                                id="birthDate"
                                type="date"
                                value={birthDate.split('T')[0]}
                                onChange={(e) => setBirthDate(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className='flex justify-center'>
                        <Button type="submit" className="w-1/3">Atualizar</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}