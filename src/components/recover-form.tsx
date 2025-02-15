import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function RecoverForm() {
  return (
    <form>
      <div className="lg:max-w-lg lg:mx-auto lg:me-0 ms-auto">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              Recupere sua senha
            </h2>
            <CardDescription>
              Insira seu nova senha abaixo e depois faça o login.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 col-span-2">
                <Label htmlFor="password">Nova Senha</Label>
                <Input id="password" type="password" placeholder="*******" />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="*******"
                />
              </div>

              <Button className="mt-3 col-span-2">Salvar e fazer login</Button>
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
