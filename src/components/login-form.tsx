import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function LoginForm() {
  return (
    <form>
      <div className="lg:max-w-lg lg:mx-auto lg:me-0 ms-auto">
        <Card>
          <CardHeader>
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
                <Input id="email" type="email" placeholder="me@example.com" />
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
                <Input id="password" type="password" placeholder="*******" />
              </div>

              <Button className="mt-3 col-span-2">Entrar</Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{' '}
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
