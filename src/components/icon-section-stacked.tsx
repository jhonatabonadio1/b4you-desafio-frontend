import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadIcon, LockIcon, EyeIcon, LayersIcon, CloudIcon, PanelTop } from "lucide-react";

export function IconSectionStackedCards() {
  return (
    <section className="border-grid border-b">
      <div className="container-wrapper">
        <div className="container flex flex-col gap-1 py-8 md:py-10 lg:py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 items-center gap-6 md:gap-10">
            {/** Card **/}
            <Card>
              <CardHeader className="pb-4 flex-row items-center gap-4">
                <div className="inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-2 bg-primary">
                  <UploadIcon className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle>Upload PDFs</CardTitle>
              </CardHeader>
              <CardContent>
                Envie e armazene seus documentos na nuvem com segurança, reduzindo custos com servidores próprios.
              </CardContent>
            </Card>
            {/** End Card **/}

            {/** Card **/}
            <Card>
              <CardHeader className="pb-4 flex-row items-center gap-4">
                <div className="inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-2 bg-primary">
                  <PanelTop className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle>Incorporação via Iframe</CardTitle>
              </CardHeader>
              <CardContent>
                Exiba PDFs diretamente no seu site sem comprometer o desempenho, garantindo carregamento rápido e eficiente.
              </CardContent>
            </Card>
            {/** End Card **/}

            {/** Card **/}
            <Card>
              <CardHeader className="pb-4 flex-row items-center gap-4">
                <div className="inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-2 bg-primary">
                  <LockIcon className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle>Controle de Acesso</CardTitle>
              </CardHeader>
              <CardContent>
                Proteja seus arquivos e defina quem pode acessá-los, garantindo maior segurança e privacidade dos seus documentos.
              </CardContent>
            </Card>
            {/** End Card **/}

            {/** Card **/}
            <Card>
              <CardHeader className="pb-4 flex-row items-center gap-4">
                <div className="inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-2 bg-primary">
                  <EyeIcon className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle>Visualização Otimizada</CardTitle>
              </CardHeader>
              <CardContent>
                Permita que visitantes visualizem PDFs no navegador sem necessidade de downloads, melhorando a experiência.
              </CardContent>
            </Card>
            {/** End Card **/}

            {/** Card **/}
            <Card>
              <CardHeader className="pb-4 flex-row items-center gap-4">
                <div className="inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-2 bg-primary">
                  <LayersIcon className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle>Conversão e Indexação</CardTitle>
              </CardHeader>
              <CardContent>
                Transforme seus PDFs em arquivos pesquisáveis e otimize a busca, melhorando a organização e acessibilidade.
              </CardContent>
            </Card>
            {/** End Card **/}

            {/** Card **/}
            <Card>
              <CardHeader className="pb-4 flex-row items-center gap-4">
                <div className="inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-2 bg-primary">
                  <CloudIcon className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle>Backup na Nuvem</CardTitle>
              </CardHeader>
              <CardContent>
                Armazene seus arquivos com segurança na nuvem, garantindo acesso rápido e sem comprometer espaço local.
              </CardContent>
            </Card>
            {/** End Card **/}
          </div>
        </div>
      </div>
    </section>
  );
}
