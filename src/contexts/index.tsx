import React, { ReactNode } from "react";

import { AuthProvider } from "./AuthContext";
import { StripeProvider } from "./StripeContext";

interface AppProviderProps {
  children: ReactNode;
}

function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <StripeProvider>{children}</StripeProvider>
    </AuthProvider>
  );
}

export { AppProvider };
