"use client"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Definindo o esquema de validação com Zod
const SignupSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  birthDate: z.string().min(1, { message: "Data de nascimento é obrigatória" }),
})

type SignupType = z.infer<typeof SignupSchema>

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupType>({
    resolver: zodResolver(SignupSchema),
  })

  const { push } = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data:SignupType) => {
    const response = await fetch("http://localhost:3333/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      push("/login");
      toast({
        title: "Cadastro realizado",
        description: "Agora você já pode fazer login",
        variant: "success",
      })

    } else {
      toast({
        title: "Erro ao cadastrar",
        description: "Verifique os dados inseridos e tente novamente",
        variant: "destructive",
      })
    }

  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Cadastrar</CardTitle>
        <CardDescription>
          Insira seus dados abaixo para criar uma conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              {...register("name")}
            />
            {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              {...register("email")}
            />
            {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
            />
            {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="birthDate">Data de Nascimento</Label>
            <Input
              id="birthDate"
              type="date"
              {...register("birthDate")}
            />
            {errors.birthDate && <span className="text-sm text-red-500">{errors.birthDate.message}</span>}
          </div>
          <Button type="submit" className="w-full">
            Cadastrar
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Já tem uma conta?{" "}
          <Link href="/login" className="underline">
            Entrar
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
