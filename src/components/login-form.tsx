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
import { useRouter } from "next/router";
import { StripeContext } from "@/contexts/StripeContext";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export function LoginForm() {
  const { signIn } = useContext(AuthContext);
  const { createCheckout} = useContext(StripeContext)

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const route = useRouter();
  const {selectedPrice, redirectCheckout} = route.query

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);
    setError(null);

    const selectedPriceValue = selectedPrice as string
    const redirectCheckoutValue = redirectCheckout === "true"

    let errorMessage;

    if(redirectCheckoutValue){
      const redirectToCheckoutAction = () => createCheckout({
        priceId: selectedPriceValue,
      })
      
       errorMessage = await signIn({ userData: data, redirectToCheckoutAction });
    }else{
       errorMessage = await signIn({ userData: data, });
    }
  

    if (errorMessage) {
      setError(errorMessage); // Exibir erro no formulário
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
              Acesse sua conta
            </h2>
            <CardDescription>
              Insira seu e-mail abaixo para fazer login em sua conta
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col col-span-2 gap-2">
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

              <div className="col-span-2 flex flex-col gap-2">
                <div className="flex flex-row items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    className="text-primary hover:underline underline-offset-4"
                    href="/forgot-password"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
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

              <Button type="submit" className="mt-3 col-span-2" disabled={loading}>
       
                {
                  loading ? <Icons.spinner className="animate-spin" /> : "Entrar"
                }
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Cadastre-se
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
