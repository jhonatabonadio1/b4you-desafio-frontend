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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { FormEvent, useContext, useEffect, useState } from "react";
import { api } from "@/services/apiClient";
import { AuthContext } from "@/contexts/AuthContext";
import { Icons } from "./icons";
import { useRouter } from "next/router";
import { toast } from "@/hooks/use-toast";
import { StripeContext } from "@/contexts/StripeContext";

interface Props {
  isOpen: boolean;
  onChange: (open: boolean) => void;
}

interface Plan {
  id: string;
  name: string;
  description: string | null;
  order: number | null;
  monthlyPriceId: string;
  annualPriceId: string;
  limit: number;
  uploadFiles: number;
  maxSize: number;
  fileSessions: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  monthlyPrice: number;
  annualPrice: number;
  featured: boolean;
}

interface RequestProps {
  currentPlan: {
    id: string;
    isAnnual: boolean;
  };
  data: Plan[];
}

export function PlanSelect({ isOpen, onChange }: Props) {
  const { user } = useContext(AuthContext);
  const { createCheckout } = useContext(StripeContext);

  const route = useRouter();

  const [isAnnual, setIsAnnual] = useState(true);
  const [plans, setPlans] = useState({} as RequestProps);

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await api.get("/plans/auth");

        setPlans(response.data);
      } catch (error) {
        console.log(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen, user.id]);

  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);

  async function createCheckoutSession(
    e: FormEvent<HTMLFormElement>,
    plan: Plan
  ) {
    e.preventDefault();

    setIsLoadingCheckout(true);

    console.log(plans.currentPlan.id);

    if (plans.currentPlan.id !== "DEFAULT") {
      try {
        const response = await api.get("/stripe/portal");
        console.log(response.data);
        return route.push(response.data);
      } catch {
        toast({
          title: "Ocorreu um problema",
          description: "Não foi possível abrir o portal de assinaturas.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingCheckout(false);
      }
    } else {
      const priceId = isAnnual ? plan.annualPriceId : plan.monthlyPriceId;

      createCheckout({
        priceId,
        onFinally: () => setIsLoadingCheckout(false),
      });
    }
  }

  const formatPrice = (number: number) => {
    const numberCalculated = number / 100;

    return numberCalculated.toLocaleString("pt-BR", {
      currency: "BRL",
      style: "currency",
    });
  };

  const formatPricePerYear = (number: number) => {
    const numberCalculated = number / 100;
    const valuePerYear = numberCalculated / 12;

    return valuePerYear.toLocaleString("pt-BR", {
      currency: "BRL",
      style: "currency",
    });
  };

  function currentPlan(
    isAnnual: boolean,
    currentPlan: { id: string; isAnnual: boolean },
    plan: { id: string }
  ) {
    const { id: currentPlanId } = currentPlan;

    if (currentPlanId === "DEFAULT") {
      return plan.id === "DEFAULT" ? true : false;
    }

    return currentPlanId === plan.id ? true : false;
  }

  function formatSize(sizeInKB: number): string {
    const sizeInMB = sizeInKB / 1024; // Converte KB para MB
    const sizeInGB = sizeInMB / 1024; // Converte MB para GB

    // Se o valor em GB for maior ou igual a 1, mostra em GB sem casas decimais
    if (sizeInGB >= 1) {
      return Math.round(sizeInMB / 1000) + " GB"; // Arredonda para o valor inteiro em GB
    }

    // Se o valor em MB for maior ou igual a 1, mostra em MB sem casas decimais
    if (sizeInMB >= 1) {
      return Math.round(sizeInMB) + " MB"; // Arredonda para o valor inteiro em MB
    }

    // Caso contrário, retorna em KB
    return sizeInKB + " KB"; // Exibe em KB se for menor que 1 MB
  }

  return (
    <Dialog onOpenChange={onChange} open={isOpen}>
      <DialogContent className="max-w-5xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Escolha seu plano</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex py-12 items-center justify-center mx-auto">
            <Icons.spinner className="animate-spin" />
          </div>
        ) : isError ? (
          <p className="text-center py-12 text-red-600">
            Ocorreu um problema ao listar os planos
          </p>
        ) : (
          <>
            <div className="flex justify-center items-center lg:mt-0 mt-10">
              <Label htmlFor="payment-schedule" className="me-3">
                Mensal
              </Label>
              <Switch
                id="payment-schedule"
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
              />
              <Label htmlFor="payment-schedule" className="relative ms-3">
                Anual
                <span className="absolute -top-10 start-auto -end-28">
                  <div className="flex items-center">
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
                    <Badge className="inline-block mt-3 uppercase w-auto rounded-full whitespace-nowrap">
                      Economize até 10%
                    </Badge>
                  </div>
                </span>
              </Label>
            </div>
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:items-center">
              {plans.data &&
                plans.data.length > 0 &&
                plans.data.map((plan) => (
                  <form
                    key={plan.id}
                    onSubmit={(e) => createCheckoutSession(e, plan)}
                    method="POST"
                  >
                    <Card
                      className={`${plan.featured ? "border-primary" : ""}`}
                    >
                      <CardHeader className="text-center pb-2">
                        <CardTitle className="flex flex-row items-center self-center gap-2 text-3xl">
                          {plan.name}{" "}
                          {plan.featured && (
                            <Badge className="uppercase rounded-full w-max self-center ">
                              Mais popular
                            </Badge>
                          )}
                        </CardTitle>
                        <span className="font-bold text-4xl flex items-end self-center">
                          {isAnnual
                            ? formatPricePerYear(plan.annualPrice)
                            : formatPrice(plan.monthlyPrice)}
                          <span className="text-xl mt-1">/mês</span>
                        </span>
                        {isAnnual && (
                          <CardDescription className="text-center text-primary w-10/12 mx-auto pb-2">
                            Você paga {formatPrice(plan.annualPrice)} por ano
                          </CardDescription>
                        )}
                      </CardHeader>

                      <CardContent>
                        <ul className="space-y-2.5 text-sm">
                        <li className="flex space-x-2">
                            <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                            <span className="text-muted-foreground">
                              Upload de até {plan.uploadFiles} PDFs
                            </span>
                          </li>
                          <li className="flex space-x-2">
                            <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                            <span className="text-muted-foreground">
                              Até {formatSize(plan.limit)} de armazenamento
                            </span>
                          </li>
                          <li className="flex space-x-2">
                            <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                            <span className="text-muted-foreground">
                              Até {formatSize(plan.maxSize)} por upload
                            </span>
                          </li>
                          <li className="flex space-x-2">
                            <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                            <span className="text-muted-foreground">
                              Até {plan.fileSessions} sessões de tracking por
                              PDF.
                            </span>
                          </li>
                          <li className="flex space-x-2">
                            <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                            <span className="text-muted-foreground">
                              Upload de até {plan.uploadFiles} PDFs
                            </span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          type="submit"
                          disabled={
                            isLoadingCheckout ||
                            currentPlan(isAnnual, plans.currentPlan, plan)
                          }
                          style={{
                            opacity:
                              isLoadingCheckout ||
                              currentPlan(isAnnual, plans.currentPlan, plan)
                                ? 0.6
                                : 1,
                          }}
                        >
                          {isLoadingCheckout ? (
                            <Icons.spinner className="animate-spin" />
                          ) : currentPlan(isAnnual, plans.currentPlan, plan) ? (
                            "Seu plano atual"
                          ) : (
                            "Assinar"
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
                ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
