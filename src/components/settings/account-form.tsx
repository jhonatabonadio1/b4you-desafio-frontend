"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "../ui/label";
import { useState } from "react";
import { Icons } from "../icons";

const accountSchema = z
  .object({
    firstName: z.string().min(2, "Mínimo de 2 caracteres"),
    lastName: z.string().min(2, "Mínimo de 2 caracteres"),
    email: z.string().email("E-mail inválido"),
    empresa: z.string().optional(),
    password: z.string().min(6, "Mínimo de 6 caracteres"),
  })
 

export function AccountForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
  });

  const onSubmit = async (data: z.infer<typeof accountSchema>) => {
    setLoading(true);
    setError(null);

    const errorMessage = "";

    if (errorMessage) {
      setError(errorMessage);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        {/* Nome e Sobrenome */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="first-name">Nome</Label>
          <Input
            id="first-name"
            placeholder="Seu nome"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="last-name">Sobrenome</Label>
          <Input
            id="last-name"
            placeholder="Seu sobrenome"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>

        {/* E-mail e Empresa */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="me@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="company">Empresa (opcional)</Label>
          <Input
            id="company"
            placeholder="Nome da empresa (opcional)"
            {...register("empresa")}
          />
        </div>

        {/* Senha e Confirmar Senha */}
        <div className="flex flex-col gap-2 col-span-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="*******"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
       

       
      </div>
      <Button type="submit" className="mt-3 col-span-2 m" disabled={loading}>
          {loading ? <Icons.spinner className="animate-spin" /> : "Salvar alterações"}
        </Button>
    </form>
  );
}
