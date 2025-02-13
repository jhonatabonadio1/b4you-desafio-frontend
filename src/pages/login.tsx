import AuthPage from "@/components/auth-page";
import { LoginForm } from "@/components/login-form";

export default function SignUp() {
  return <AuthPage render={<LoginForm />} />;
}
