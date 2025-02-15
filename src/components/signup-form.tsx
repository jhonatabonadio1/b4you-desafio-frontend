import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import { Icons } from "./icons";

// Esquema de validação com Zod
const signUpSchema = z.object({
  firstName: z.string().min(2, "Mínimo de 2 caracteres"),
  lastName: z.string().min(2, "Mínimo de 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  empresa: z.string().optional(),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
  confirmPassword: z.string().min(6, "Mínimo de 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export function SignUpForm() {
  const { signUp } = useContext(AuthContext);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setLoading(true);
    setError(null);

    const errorMessage = await signUp({ userData: data });

    if (errorMessage) {
      setError(errorMessage);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="lg:max-w-lg lg:mx-auto lg:me-0 ms-auto">
        <Card>
          <CardHeader>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              Crie sua conta grátis!
            </h2>
            <CardDescription>
              Preencha os campos abaixo para se cadastrar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {/* Nome e Sobrenome */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="first-name">Nome</Label>
                <Input id="first-name" placeholder="Seu nome" {...register("firstName")} />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="last-name">Sobrenome</Label>
                <Input id="last-name" placeholder="Seu sobrenome" {...register("lastName")} />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                )}
              </div>

              {/* E-mail e Empresa */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="me@example.com" {...register("email")} />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="company">Empresa (opcional)</Label>
                <Input id="company" placeholder="Nome da empresa (opcional)" {...register("empresa")} />
              </div>

              {/* Senha e Confirmar Senha */}
              <div className="flex flex-col gap-2 col-span-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="*******" {...register("password")} />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <Label htmlFor="confirm-password">Confirmar Senha</Label>
                <Input id="confirm-password" type="password" placeholder="*******" {...register("confirmPassword")} />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="mt-3 col-span-2" disabled={loading}>
                {loading ? <Icons.spinner className="animate-spin" /> : "Cadastrar"}
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Já tem uma conta?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Faça login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
