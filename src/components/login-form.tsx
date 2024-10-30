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
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { setLoginToken } from "@/actions/cookiesActions"

const LoginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
})

type LoginType = z.infer<typeof LoginSchema>

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
  })

  const { push } = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data: LoginType) => {
    try {
      const response = await fetch("http://localhost:3333/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const { token }:{ token:string } = await response.json();

        await setLoginToken(token);

        push("/");

      } else {
        toast({
          title: "Credenciais inválidas",
          description: "Verifique seu email e senha e tente novamente",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao tentar fazer login:", error);
      toast({
        title: "Erro no servidor",
        description: "Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Entrar</CardTitle>
        <CardDescription>
          Insira seu email abaixo para entrar na sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
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
            <div className="flex items-center">
              <Label htmlFor="password">Senha</Label>
            </div>
            <Input
              id="password"
              type="password"
              {...register("password")}
            />
            {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Não tem conta?{" "}
          <Link href="/sign-up" className="underline">
            Cadastre-se
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
