import AuthPage from "@/components/auth-page";
import { LoginForm } from "@/components/login-form";
import { withSSRGuest } from "@/utils/withSSRGuest";
import Head from "next/head";

export default function SignIn() {
  return (
    <>
      <Head>
        <title>Acesse sua conta - Incorporae!</title>
      </Head>
      <AuthPage render={<LoginForm />} />
    </>
  );
}


export const getServerSideProps = withSSRGuest(async () => {
  return {
    props: {},
  };
});
