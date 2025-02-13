import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function SignUpForm() {
  return (
    <form>
      <div className="lg:max-w-lg lg:mx-auto lg:me-0 ms-auto">
        <Card>
          <CardHeader>
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
                <Input id="first-name" placeholder="Seu nome" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="last-name">Sobrenome</Label>
                <Input id="last-name" placeholder="Seu sobrenome" />
              </div>

              {/* E-mail e Empresa */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="me@example.com" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" placeholder="Nome da empresa" />
              </div>

              {/* Senha e Confirmar Senha */}
              <div className="flex flex-col gap-2 col-span-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="*******" />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <Label htmlFor="confirm-password">Confirmar Senha</Label>
                <Input id="confirm-password" type="password" placeholder="*******" />
              </div>

              <Button className="mt-3 col-span-2">Cadastrar</Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Já tem uma conta?{' '}
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
