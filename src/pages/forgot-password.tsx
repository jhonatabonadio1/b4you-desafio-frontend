import AuthPage from "@/components/auth-page";

import { ForgotForm } from "@/components/forgot-form";
import { withSSRGuest } from "@/utils/withSSRGuest";
import Head from "next/head";

export default function ForgotPassword() {
  return (
    <>
      <Head>
        <title>Recupere sua senha - Incorporae!</title>
      </Head>
      <AuthPage render={<ForgotForm />} />
    </>
  );
}


export const getServerSideProps = withSSRGuest(async () => {
  return {
    props: {},
  };
});
