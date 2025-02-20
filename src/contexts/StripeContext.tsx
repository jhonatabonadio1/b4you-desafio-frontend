import { ReactNode, createContext } from "react";

import { useRouter } from "next/router";
import { api } from "@/services/apiClient";

type StripeContextData = {
  createCheckout: ({ priceId, onFinally }: CheckoutProps) => void;
};

interface CheckoutProps {
  priceId: string;
  onFinally?: () => void;
}

type StripeProviderProps = {
  children: ReactNode;
};

export interface Plan {
  name: string;
  description: string;
  price: {
    monthly: string;
    monthlyAnual: string;
    annual: string;
  };
  priceIds?: {
    monthly: string;
    annual: string;
  };
  features: string[];
}

export const StripeContext = createContext({} as StripeContextData);

export function StripeProvider({ children }: StripeProviderProps) {

  const route = useRouter();

  async function createCheckout({ priceId, onFinally }: CheckoutProps) {

      try {
        const response = await api.post("/stripe/create-checkout", {
          priceId,
        });

        route.push(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        if (onFinally) {
          onFinally();
        }
      }
    
  }

  return (
    <StripeContext.Provider
      value={{
        createCheckout,
      }}
    >
      {children}
    </StripeContext.Provider>
  );
}
