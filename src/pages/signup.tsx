import { SignUpForm } from "@/components/signup-form";

import AuthPage from "@/components/auth-page";

export default function SignUp() {
  return <AuthPage render={<SignUpForm />} />;
}
