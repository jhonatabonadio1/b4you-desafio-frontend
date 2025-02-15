import AuthPage from "@/components/auth-page";

import { RecoverForm } from "@/components/recover-form";
import { withSSRGuest } from "@/utils/withSSRGuest";
import Head from "next/head";

export default function RecoverPassword() {
  return (
    <>
      <Head>
        <title>Trocar senha - Incorporae!</title>
      </Head>
      <AuthPage render={<RecoverForm />} />
    </>
  );
}

export const getServerSideProps = withSSRGuest(async () => {
  return {
    props: {},
  };
});
