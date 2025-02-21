import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { api } from "@/services/apiClient";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { CheckCircle } from "lucide-react";

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Success() {
  const route = useRouter();

  const { session_id } = route.query;

  const [show, setShow] = useState(false)

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function verifySessionExists() {
      if (!session_id) {
        return route.push("/documents");
      } else {
        try {
          await api.get("/stripe/session/" + session_id);
        } catch {
          return route.push("/documents");
          setShow(true)
        } finally {
          setIsLoading(false);
        }
      }
    }

    verifySessionExists();
  }, [route, session_id]);

  return (
    <>
      <Head>
        <title>Compra Concluída - Incorporae!</title>
      </Head>
      <div data-wrapper="" className="border-grid flex flex-1 flex-col">
        <main className="flex flex-1 flex-col">
          <section className="border-grid border-b">
            <div className="container-wrapper">
              <div className="container items-center justify-center flex h-screen flex-col gap-1 py-8 md:py-10 lg:py-12">
                {isLoading && show ?(
                  <Icons.spinner className="animate-spin" />
                ) : (
                  <>
                    <div className="text-green-400">
                      <CheckCircle size={72} />
                    </div>
                    <div className="flex flex-col gap-2 items-center mt-4">
                      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-2xl">
                        Sua assinatura foi iniciada.
                      </h1>
                      <p>
                        Acesse nossa plataforma para fazer o upload de um
                        documento.
                      </p>
                      <Button
                        className="mt-2"
                        onClick={() => route.push("/documents")}
                      >
                        Ir para a plataforma
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async () => ({ props: {} }));
