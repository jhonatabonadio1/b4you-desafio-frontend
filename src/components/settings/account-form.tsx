/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useEffect, useState } from "react";
import { Icons } from "../icons";

import { api } from "@/services/apiClient";
import { toast } from "@/hooks/use-toast";
import { AuthContext } from "@/contexts/AuthContext";

const accountSchema = z.object({
  firstName: z.string().min(2, "Mínimo de 2 caracteres"),
  lastName: z.string().min(2, "Mínimo de 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  empresa: z.string().optional(),
});

export function AccountForm() {
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),

    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      empresa: user?.empresa || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        empresa: user.empresa,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: z.infer<typeof accountSchema>) => {
    setLoading(true);

    try {
      const response = await api.put("/users", data);

      toast({
        title: "Sucesso!",
        description: "Usuário alterado com sucesso.",
        variant: "default",
      });

      reset();
      updateUser(response.data);
    } catch (err: any) {
      toast({
        title: "Erro!",
        description: err.response?.data?.error || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
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
      </div>
      <Button type="submit" className="mt-3 col-span-2" disabled={loading}>
        {loading ? (
          <Icons.spinner className="animate-spin" />
        ) : (
          "Salvar alterações"
        )}
      </Button>
    </form>
  );
}
