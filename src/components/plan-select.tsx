import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { useState } from "react";

const pricingPlans = [
  {
    name: "Free",
    description: "Plano gratuito para quem precisa de algo básico.",
    price: { monthly: "R$0", monthlyAnual: "R$0", annual: "R$0" },
    features: ["1 PDF", "20MB", "Iframe 1 Domínio"],
  },
  {
    name: "Start",
    description: "Ideal para pequenos negócios.",
    price: { monthly: "R$29", monthlyAnual: "R$21", annual: "R$210" },
    features: ["50 PDFs", "2GB", "Iframe 3 Domínios"],
  },
  {
    name: "Pro",
    description: "Para empresas com alta demanda.",
    price: { monthly: "R$79", monthlyAnual: "R$71", annual: "R$710" },
    features: ["200 PDFs", "10GB", "Iframe 10 Domínios"],
  },
  {
    name: "Business",
    description: "Solução para grandes empresas.",
    price: { monthly: "R$199", monthlyAnual: "R$179", annual: "R$1799" },
    features: ["1000 PDFs", "50GB", "Suporte premium"],
  },
];

interface Props {
  currentPlan: {
    name: string;
    anual: boolean;
  };
  isOpen: boolean;
  onChange: (open: boolean) => void;
}

export function PlanSelect({ currentPlan, isOpen, onChange }: Props) {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <Dialog onOpenChange={onChange} open={isOpen}>

      <DialogContent className="max-w-3xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Escolha seu plano</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center items-center lg:mt-0 mt-10">
          <Label htmlFor="payment-schedule" className="me-3">
            Monthly
          </Label>
          <Switch
            id="payment-schedule"
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
          />
          <Label htmlFor="payment-schedule" className="relative ms-3">
            Annual
            <span className="absolute -top-10 start-auto -end-28">
              <span className="flex items-center">
                <svg
                  className="w-14 h-8 -me-6"
                  width={45}
                  height={25}
                  viewBox="0 0 45 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M43.2951 3.47877C43.8357 3.59191 44.3656 3.24541 44.4788 2.70484C44.5919 2.16427 44.2454 1.63433 43.7049 1.52119L43.2951 3.47877ZM4.63031 24.4936C4.90293 24.9739 5.51329 25.1423 5.99361 24.8697L13.8208 20.4272C14.3011 20.1546 14.4695 19.5443 14.1969 19.0639C13.9242 18.5836 13.3139 18.4152 12.8336 18.6879L5.87608 22.6367L1.92723 15.6792C1.65462 15.1989 1.04426 15.0305 0.563943 15.3031C0.0836291 15.5757 -0.0847477 16.1861 0.187863 16.6664L4.63031 24.4936ZM43.7049 1.52119C32.7389 -0.77401 23.9595 0.99522 17.3905 5.28788C10.8356 9.57127 6.58742 16.2977 4.53601 23.7341L6.46399 24.2659C8.41258 17.2023 12.4144 10.9287 18.4845 6.96211C24.5405 3.00476 32.7611 1.27399 43.2951 3.47877L43.7049 1.52119Z"
                    fill="currentColor"
                    className="text-muted-foreground"
                  />
                </svg>
                <Badge className="mt-3 uppercase">Save up to 10%</Badge>
              </span>
            </span>
          </Label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`${currentPlan.name === plan.name ? "border-primary" : ""} flex flex-col`}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex items-center gap-2 self-center">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  {currentPlan.name === plan.name && <Badge>Plano Atual</Badge>}
                </div>
                <span className="font-bold text-5xl flex items-end self-center">
                  {isAnnual ? plan.price.monthlyAnual : plan.price.monthly}
                  <span className="text-xl mt-1">/mês</span>
                </span>
                {isAnnual && plan.name !== "Free" && (
                  <CardDescription className="text-center text-primary w-10/12 mx-auto">
                    Você paga {plan.price.annual} por ano
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex flex-col flex-1 justify-between">
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckIcon className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-4"
                  disabled={currentPlan.name === plan.name}
                >
                  {currentPlan.name === plan.name ? "Seu plano" : "Selecionar"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
