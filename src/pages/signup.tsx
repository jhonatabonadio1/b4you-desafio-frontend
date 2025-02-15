import { SignUpForm } from "@/components/signup-form";

import AuthPage from "@/components/auth-page";
import Head from "next/head";
import { withSSRGuest } from "@/utils/withSSRGuest";

export default function SignUp() {
  return (
    <>
      <Head>
        <title>Crie sua conta grátis - Incorporae!</title>
      </Head>
      <AuthPage render={<SignUpForm />} />
    </>
  );
}


export const getServerSideProps = withSSRGuest(async () => {
  return {
    props: {},
  };
});
