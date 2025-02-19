 
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/apiClient";
import { useRouter } from "next/router";
import { Icons } from "./icons";

export function ForgotForm() {
  const route = useRouter();
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    if (!email) {
      toast({
        title: "Erro",
        description: "Por favor, insira um endereço de e-mail válido.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulação de envio do e-mail de recuperação
      await api.post("/auth/recovery", {
        email,
      });

      toast({
        title: "Sucesso",
        description: "E-mail de recuperação enviado com sucesso!",
      });
      setEnviado(true);
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response.data.error ?? "Não foi possível enviar o e-mail de recuperação",
        variant: "destructive",
      });
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="lg:max-w-lg lg:mx-auto lg:me-0 ms-auto">
        {enviado ? (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold leading-none tracking-tight">
                Verifique seu e-mail
              </h2>
              <CardDescription>
                Enviamos um link para você recuperar sua senha. Caso não
                encontre, olhe sua caixa de spam. E-mails são enviados em até 15
                minutos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                
                <Button type="button" onClick={() => route.push("/login")} className="mt-3 col-span-2">
                  Fazer login
                </Button>
              </div>

          
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold leading-none tracking-tight">
                Recupere sua senha
              </h2>
              <CardDescription>
                Insira seu e-mail abaixo para recuperar a sua senha.
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                 <Button type="submit" className="mt-3 col-span-2" disabled={isLoading} style={{opacity: isLoading ? "0.7" : "1"}}>
                            {
                             isLoading ? <Icons.spinner className="animate-spin" /> : " Enviar e-mail de recuperação"
                            }
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
        )}
      </div>
    </form>
  );
}
