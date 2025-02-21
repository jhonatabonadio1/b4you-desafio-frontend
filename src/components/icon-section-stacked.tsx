import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadIcon, LockIcon, EyeIcon, LayersIcon, CloudIcon, PanelTop } from "lucide-react";

export function IconSectionStackedCards() {
  return (
    <section className="border-grid border-b">
      <div className="container-wrapper">
        <div className="container flex flex-col gap-1 py-8 md:py-10 lg:py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 items-center gap-6 md:gap-10">
            {/** Card **/}
            <Card className="h-full">
              <CardHeader className="pb-4 flex-row items-center gap-4">
                <div className="inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-2 bg-primary">
                  <UploadIcon className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle>Upload PDFs</CardTitle>
              </CardHeader>
              <CardContent>
              Centralize seus materiais de marketing e vendas em um ambiente seguro e acessível.
              </CardContent>
            </Card>
            {/** End Card **/}

            {/** Card **/}
            <Card className="h-full">
              <CardHeader className="pb-4 flex-row items-center gap-4">
                <div className="inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-2 bg-primary">
                  <PanelTop className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle>Incorporação via Iframe</CardTitle>
              </CardHeader>
              <CardContent>
              Exiba e compartilhe e-books, catálogos e apresentações diretamente no seu site sem comprometer a performance.
              </CardContent>
            </Card>
            {/** End Card **/}

            {/** Card **/}
            <Card className="h-full">
              <CardHeader className="pb-4 flex-row items-center gap-4">
                <div className="inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-2 bg-primary">
                  <LockIcon className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle>Criptografia Ponta a Ponta</CardTitle>
              </CardHeader>
              <CardContent>
                Tenha seus documentos protegidos e criptografados.
              </CardContent>
            </Card>
            {/** End Card **/}

            {/** Card **/}
            <Card className="h-full">
              <CardHeader className="pb-4 flex-row items-center gap-4">
                <div className="inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-2 bg-primary">
                  <EyeIcon className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle>Rastreamento e Insights</CardTitle>
              </CardHeader>
              <CardContent>
              Descubra onde seu público foca a atenção, tem dúvidas ou abandona a leitura para melhorar seu conteúdo.
              </CardContent>
            </Card>
            {/** End Card **/}

            {/** Card **/}
            <Card className="h-full">
              <CardHeader className="pb-4 flex-row items-center gap-4">
                <div className="inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-2 bg-primary">
                  <LayersIcon className="flex-shrink-0 w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle>Visualização Otimizada</CardTitle>
              </CardHeader>
              <CardContent>
              Permita que leads e clientes acessem seus conteúdos sem precisar baixar, garantindo uma experiência fluida.
              </CardContent>
            </Card>
            {/** End Card **/}

            {/** Card **/}
            <Card className="h-full">
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
