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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { CheckIcon } from "lucide-react";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import { Icons } from "./icons";

import { useRouter } from "next/router";
import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient";

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

export function PricingSectionCards() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [plans, setPlans] = useState([] as Plan[]);

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await api.get("/plans");

        setPlans(response.data);
      } catch (error) {
        console.log(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlans();
  }, []);

  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);

  const route = useRouter();
  const { isAuthenticated } = useContext(AuthContext);

  async function createCheckoutSession(
    e: FormEvent<HTMLFormElement>,
    plan: Plan
  ) {
    e.preventDefault();

    setIsLoadingCheckout(true);

    if (plan && plan.id !== "DEFAULT") {
      const priceId = isAnnual ? plan.annualPriceId : plan.monthlyPriceId;

      if (isAuthenticated) {
        route.push("/documents?choosePlan=true");
      } else {
        route.push("/signup?redirectCheckout=true&selectedPrice=" + priceId);
      }
    } else {
      route.push("/signup");
    }
  }

  const formatPrice = (number: number) => {
    const numberCalculated = number / 100 

    return numberCalculated.toLocaleString("pt-BR", {
       currency: "BRL",
      style: "currency"
    })
  }

  const formatPricePerYear = (number: number) => {
    const numberCalculated = number / 100 
    const valuePerYear = numberCalculated / 12

    return valuePerYear.toLocaleString("pt-BR", {
       currency: "BRL",
      style: "currency"
    })
  }

  return (
    <section className="border-grid border-b" id="planos">
      <div className="container-wrapper">
        <div className="container flex flex-col gap-1 py-8 md:py-10 lg:py-12">
          <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              Pricing
            </h2>
            <p className="mt-1 text-muted-foreground">
              Escolha o plano ideal para você.
            </p>
          </div>

          {/* Switch */}
          <div className="flex justify-center items-center">
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
          {/* End Switch */}

          {isLoading ? (
            <div className="flex py-12 items-center justify-center mx-auto">
              <Icons.spinner className="animate-spin" />
            </div>
          ) : isError ? (
            <p className="text-center py-12 text-red-600">
              Ocorreu um problema ao listar os planos
            </p>
          ) : (
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:items-center">
              {plans.length > 0 &&
                plans.map((plan) => (
                  <form
                    key={plan.id}
                    onSubmit={(e) => createCheckoutSession(e, plan)}
                    method="POST"
                  >
                    <Card
                      className={`${plan.featured ? "border-primary" : ""}`}
                    >
                      <CardHeader className="text-center pb-2">
                        {plan.featured && (
                          <Badge className="uppercase rounded-full w-max self-center mb-2">
                            Mais popular
                          </Badge>
                        )}
                        <CardTitle className="!mb-2 text-3xl">
                          {plan.name}
                        </CardTitle>
                        <span className="font-bold text-4xl flex items-end self-center">
                          {isAnnual ? formatPricePerYear(plan.annualPrice) : formatPrice(plan.monthlyPrice)}
                          <span className="text-xl mt-1">/mês</span>
                        </span>
                        {isAnnual && (
                          <CardDescription className="text-center text-primary w-10/12 mx-auto pb-2">
                            Você paga {formatPrice(plan.annualPrice)} por ano
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardDescription className="text-center  w-10/12 mx-auto">
                        {plan.description}
                      </CardDescription>
                      <CardContent>
                        <ul className="mt-7 space-y-2.5 text-sm">
                          <li className="flex space-x-2">
                            <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                            <span className="text-muted-foreground">
                              Até {(plan.limit / 1024) > 1000 ? (plan.limit / 1024).toFixed(2).charAt(0) + " GB" : (plan.limit / 1024).toFixed(2) + " MB"} de armazenamento
                            </span>
                          </li>
                          <li className="flex space-x-2">
                            <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                            <span className="text-muted-foreground">
                              Até {(plan.maxSize / 1024) > 1000 ? (plan.maxSize / 1024).toFixed(2).charAt(0) + " GB" : (plan.maxSize / 1024).toFixed(2) + " MB"} por upload
                            </span>
                          </li>
                          <li className="flex space-x-2">
                            <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                            <span className="text-muted-foreground">
                              Até {plan.fileSessions} sessões de tracking.
                            </span>
                          </li>
                          <li className="flex space-x-2">
                            <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                            <span className="text-muted-foreground">
                              Até {plan.uploadFiles} PDFs
                            </span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          type="submit"
                          disabled={isLoadingCheckout}
                          style={{
                            opacity: isLoadingCheckout ? 0.6 : 1,
                          }}
                        >
                          {isLoadingCheckout ? (
                            <Icons.spinner className="animate-spin" />
                          ) : (
                            plan.id === "DEFAULT" ? "Começar agora" : "Assinar"
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
                ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
