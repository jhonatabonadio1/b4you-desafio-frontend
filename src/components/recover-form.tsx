/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/apiClient";
import { useState } from "react";
import { Icons } from "./icons";

const schema = z
  .object({
    password: z.string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(
      /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/,
          "Pelo menos 1 caractere especial e 1 leletra maiúscula"
    ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export function RecoverForm() {
  const router = useRouter();
  const { requestId } = router.query;

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  if (!requestId) {
    router.push("/login");
    return null;
  }

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      await api.put("/users/update-password", {
        requestId,
        password: data.password,
      });

      toast({
        title: "Senha redefinida com sucesso!",
        description:
          "Agora, faça o login em sua conta utilizando sua nova senha.",
      });

      router.push("/login");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao redefinir a senha.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="lg:max-w-lg lg:mx-auto lg:me-0 ms-auto">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              Recupere sua senha
            </h2>
            <CardDescription>
              Insira sua nova senha abaixo e depois faça o login.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 col-span-2">
                <Label htmlFor="password">Nova Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="*******"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="*******"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="mt-3 col-span-2"
                disabled={isLoading}
                style={{ opacity: isLoading ? "0.7" : "1" }}
              >
                {isLoading ? (
                  <Icons.spinner className="animate-spin" />
                ) : (
                  " Trocar senha"
                )}
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Já possui uma senha?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Faça o login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
