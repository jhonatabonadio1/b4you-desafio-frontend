/* eslint-disable @next/next/no-img-element */
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Book, Building, Clock, Cloud, Code, Code2, Eye, FileChartColumn, GraduationCap, Headset, Mouse, Rocket, Signature } from "lucide-react";

import { useRouter } from "next/router";
import homemPreocupado from "@/assets/homem-preocupado.webp";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SiteFooter } from "@/components/site-footer";

const faqs = [
    {
      question: "O que é o Incorporaê?",
      answer:
        "O Incorporaê é uma plataforma que permite a incorporação de documentos PDF em sites e aplicativos de forma fácil e segura, oferecendo opções avançadas de personalização e controle de acesso.",
    },
    {
      question: "Como faço para incorporar um PDF no meu site?",
      answer:
        "Após o upload do seu arquivo PDF na plataforma Incorporaê, você receberá um link de incorporação (iframe) que pode ser adicionado ao seu site com apenas algumas linhas de código.",
    },
    {
      question: "O Incorporaê é compatível com todos os navegadores?",
      answer:
        "Sim, nossos embeds são compatíveis com todos os navegadores modernos, incluindo Google Chrome, Firefox, Safari e Edge.",
    },
    {
      question: "Posso restringir o acesso ao meu documento?",
      answer:
        "Sim! O Incorporaê permite definir restrições de acesso, como proteção por senha e restrição de visualização para domínios específicos.",
    },
    {
      question: "O Incorporaê oferece estatísticas de visualização?",
      answer:
        "Sim, nossa plataforma fornece relatórios detalhados sobre o número de visualizações, tempo médio de leitura e interações com o documento.",
    },
    {
      question: "Existe uma versão gratuita do Incorporaê?",
      answer:
        "Sim, oferecemos um plano gratuito com funcionalidades básicas. Para recursos avançados, é possível optar por um dos nossos planos pagos.",
    }
  ];

  
export default function LP() {
  const route = useRouter();
  return (
    <div className="flex  flex-col">
      <section className="relative overflow-hidden py-24 lg:py-32">
      <div
            aria-hidden="true"
            className="flex absolute -top-96 start-1/2 transform -translate-x-1/2"
          >
            <div className="bg-gradient-to-r from-background/50 to-background blur-3xl w-[25rem] h-[44rem] rotate-[-60deg] transform -translate-x-[10rem]" />
            <div className="bg-gradient-to-tl blur-3xl w-[90rem] h-[50rem] rounded-full origin-top-left -rotate-12 -translate-x-[15rem] from-primary-foreground via-primary-foreground to-background" />
          </div>
          {/* End Gradients */}
        <div className="container relative z-10 !max-w-[65rem] flex  flex-col items-center text-center gap-12 justify-center mx-auto px-4">
          <Icons.logoFull className="h-12 w-auto" />

          <h1 className="text-5xl font-bold">
            VOCÊ REALMENTE SABE QUEM ESTÁ LENDO SEUS PDFS?
          </h1>
          <div className="flex flex-col gap-2 text-2xl">
            <p>Seus materiais estão sendo lidos ou ignorados?</p>
            <p>Quais páginas do seu documento despertam mais interesse?</p>
            <p>
              Como otimizar suas apresentações para engajar mais seu público?
            </p>
          </div>
          <h3 className="text-4xl font-bold">
            SE VOCÊ NÃO TEM ESSAS RESPOSTAS, PODE ESTAR PERDENDO OPORTUNIDADES
            VALIOSAS!
          </h3>
          <Button
            onClick={() => route.push("https://incorporae.com.br/signup")}
            size="lg"
            className="rounded-full text-xl h-auto py-3"
          >
            Quero insights do meu PDF
          </Button>
        </div>
      </section>

      <section className="pb-24 lg:pb-32">
        <div className="container !max-w-[65rem] flex  flex-col items-center text-center gap-12 justify-center mx-auto px-4">
          <h1 className="text-5xl font-bold">
            SEUS PDFS MERECEM MAIS DO QUE APENAS UM LINK DE DOWNLOAD!
          </h1>
          <div className="flex flex-col gap-4 text-2xl">
            <p>
              Se você compartilha PDFs sem saber como eles são consumidos, está
              deixando informações preciosas passarem despercebidas.
            </p>
            <p>
              O Incorporaê foi criado para professores, agências de marketing e
              empresas que usam PDFs como ferramenta de apresentação e querem
              entender exatamente como seu público interage com eles.
            </p>
          </div>
          <h3 className="text-4xl font-bold">
            O QUE O INCORPORAÊ FAZ POR VOCÊ?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="flex flex-col gap-2 items-center justify-center">
              <Cloud className="w-16 h-16" />
              <h3 className="text-xl text-center">
                Armazena seus PDFs na nuvem com acesso rápido e seguro.
              </h3>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center">
              <Code className="w-16 h-16" />
              <h3 className="text-xl text-center">
                Permite incorporar PDFs via iframe, mesmo sem ter um site.
              </h3>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center">
              <Eye className="w-16 h-16" />
              <h3 className="text-xl text-center">
                Monitora visualizações e leitores ativos em tempo real.
              </h3>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center">
              <Mouse className="w-16 h-16" />
              <h3 className="text-xl text-center">
                Exibe um mapa de calor, mostrando as áreas mais visualizadas.
              </h3>
            </div>
          </div>

          <h3 className="text-4xl font-bold">
            TUDO ISSO SEM COMPLICAÇÃO, COM UMA INTERFACE INTUITIVA E UM PREÇO
            ACESSÍVEL!
          </h3>
        </div>
      </section>

      <section className="pb-24 lg:pb-32">
        <div className="container !max-w-[65rem] flex  flex-col items-center text-center gap-12 justify-center mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 text-left gap-12">
            <div className="relative">
              <div className="bg-white/5 p-2 rounded-3xl absolute w-full h-full -top-8 -left-8 -z-10"></div>
              <img
                className="!w-full !h-full rounded-3xl object-cover"
                src={homemPreocupado.src}
                alt="Homem preocupado com seu PDF"
              />
            </div>
            <div className="flex flex-col gap-6 text-xl">
              <h1 className="text-5xl font-bold">
                NÃO CONTINUE APOSTANDO NO ESCURO!
              </h1>
              <p>
                Estudos mostram que mais de 80% dos PDFs enviados por empresas e
                profissionais não são lidos integralmente!
              </p>
              <p>
                Sem dados sobre seus documentos, você não pode melhorar suas
                estratégias. Você pode estar perdendo negócios, engajamento e
                oportunidades simplesmente porque não tem as informações certas
                para agir.
              </p>
              <h3 className="text-2xl font-bold">
                Com o Incorporaê, você transforma cada PDF em uma ferramenta
                poderosa de análise e otimização.
              </h3>
              <Button
                onClick={() => route.push("https://incorporae.com.br/signup")}
                size="lg"
                className="rounded-full text-xl h-auto py-3"
              >
                Começar a rastrear
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 lg:pb-32">
        <div className="container !max-w-[65rem] flex  flex-col items-center text-center gap-12 justify-center mx-auto px-4">
          <div className="flex flex-col gap-6 text-xl">
            <h1 className="text-5xl font-bold text-left">
              VEJA COMO O INCORPORAÊ IMPACTOU NOSSOS CLIENTES
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="text-left">
                <CardHeader>
                  <h3 className="font-bold">Carlos Mendes</h3>
                  <p className="text-sm text-white/70">
                    Gerente de Marketing Digital
                  </p>
                </CardHeader>
                <CardContent>
                  <p>
                    Agora sei exatamente quem abriu meus materiais e quais
                    páginas despertaram mais interesse. Isso me ajudou a
                    personalizar melhor minhas propostas e aumentar minhas
                    conversões.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-left">
                <CardHeader>
                  <h3 className="font-bold">Ana Souza</h3>
                  <p className="text-sm text-white/70">
                    Professora Universitária
                  </p>
                </CardHeader>
                <CardContent>
                  <p>
                    Sou professora e precisava entender como meus alunos
                    interagem com os materiais de estudo. O Incorporaê me deu
                    uma visão completa sobre engajamento e aprendizado.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-left">
                <CardHeader>
                  <h3 className="font-bold">Mariana Silva</h3>
                  <p className="text-sm text-white/70">
                    Gerente de Tráfego Pago
                  </p>
                </CardHeader>
                <CardContent>
                  <p>
                    Graças ao Incorporaê, consegui identificar exatamente onde
                    meus leitores perdem interesse e ajustar meus conteúdos para
                    manter a atenção do público. Agora, minhas campanhas têm
                    resultados surpreendentes.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-left">
                <CardHeader>
                  <h3 className="font-bold">Roberto Almeida</h3>
                  <p className="text-sm text-white/70">Treinador Corporativo</p>
                </CardHeader>
                <CardContent>
                  <p>
                    Utilizo o Incorporaê em meus treinamentos corporativos e os
                    insights obtidos com os dados dos PDFs são incríveis. A
                    capacidade de visualizar o comportamento do leitor em tempo
                    real revolucionou nossa abordagem.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-left">
                <CardHeader>
                  <h3 className="font-bold">Fernanda Castro</h3>
                  <p className="text-sm text-white/70">
                    Autora e Empreendedora
                  </p>
                </CardHeader>
                <CardContent>
                  <p>
                    O Incorporaê me proporcionou uma visão detalhada do
                    desempenho dos meus e-books. Hoje, consigo aprimorar
                    continuamente o conteúdo com base nas interações dos
                    leitores, aumentando significativamente minha taxa de
                    conversão.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-left">
                <CardHeader>
                  <h3 className="font-bold">Lucas Moreira</h3>
                  <p className="text-sm text-white/70">Consultor de Vendas</p>
                </CardHeader>
                <CardContent>
                  <p>
                    Antes, eu enviava propostas para clientes e ficava sem saber
                    se eles realmente as liam. Com o Incorporaê, posso ver quais
                    partes chamam mais atenção e adaptar minha abordagem para
                    fechar mais negócios.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 lg:pb-32">
        <div className="container !max-w-[65rem] flex  flex-col items-center text-center gap-12 justify-center mx-auto px-4">
          <div className="flex flex-col gap-12 text-xl">
            <h1 className="text-5xl font-bold">
              PARA QUEM O INCORPORAÊ É INDICADO?
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="flex flex-col gap-2 items-center justify-center">
                <GraduationCap className="w-16 h-16" />
                <h3 className="text-xl text-center">
                <b>Professores</b> que querem saber se os alunos realmente leem os materiais.
                </h3>
              </div>
              <div className="flex flex-col gap-2 items-center justify-center">
                <Icons.meta className="w-16 h-16" />
                <h3 className="text-xl text-center">
                <b>Agências de Marketing</b> que enviam apresentações e propostas para clientes.
                </h3>
              </div>
              <div className="flex flex-col gap-2 items-center justify-center">
                <Building className="w-16 h-16" />
                <h3 className="text-xl text-center">
                <b>Empresas</b> que utilizam PDFs para onboarding, treinamentos e relatórios.
                </h3>
              </div>
              <div className="flex flex-col gap-2 items-center justify-center">
                <Book className="w-16 h-16" />
                <h3 className="text-xl text-center">
                <b>Escritores e criadores de conteúdo</b> que compartilham e-books e whitepapers.
                </h3>
              </div>
            </div>
            <Button
                onClick={() => route.push("https://incorporae.com.br/signup")}
                size="lg"
                className="rounded-full self-center text-xl h-auto py-3"
              >
                Quero começar agora!
              </Button>
          </div>
        </div>
      </section>

      <section className="pb-24 lg:pb-32">
        <div className="container !max-w-[65rem] flex  flex-col items-center text-center gap-12 justify-center mx-auto px-4">
          <div className="flex flex-col gap-12 text-xl">
            <h1 className="text-5xl font-bold uppercase">
            Tudo o Que Você Vai Receber ao UTILIZAR o Incorporaê
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="flex flex-col gap-2 items-center justify-center">
                <FileChartColumn className="w-16 h-16" />
                <h3 className="text-xl text-center">
                Monitoramento Completo de PDFs
                </h3>
              </div>
              <div className="flex flex-col gap-2 items-center justify-center">
                <Mouse className="w-16 h-16" />
                <h3 className="text-xl text-center">
                Mapas de Calor para Análise de Engajamento
                </h3>
              </div>
              <div className="flex flex-col gap-2 items-center justify-center">
                <Clock className="w-16 h-16" />
                <h3 className="text-xl text-center">
                Insights de Tempo de Leitura por Página
                </h3>
              </div>
             
              <div className="flex flex-col gap-2 items-center justify-center">
                <Eye className="w-16 h-16" />
                <h3 className="text-xl text-center">
                Leitores Ativos em Tempo Real
                </h3>
              </div>
              <div className="flex flex-col gap-2 items-center justify-center">
                <Code2 className="w-16 h-16" />
                <h3 className="text-xl text-center">
                Opção de Compartilhamento Fácil via Link ou Iframe
                </h3>
              </div>
              <div className="flex flex-col gap-2 items-center justify-center">
                <Rocket className="w-16 h-16" />
                <h3 className="text-xl text-center">
                Carregamento Otimizado para PDFs Grandes
                </h3>
              </div>
              <div className="flex flex-col gap-2 items-center justify-center">
                <Headset className="w-16 h-16" />
                <h3 className="text-xl text-center">
                Suporte Prioritário via Chat e E-mail
                </h3>
              </div>
              <div className="flex flex-col gap-2 items-center justify-center">
                <Signature className="w-16 h-16" />
                <h3 className="text-xl text-center">
                Assinaturas Eletrônicas para PDFs (EM BREVE)
                </h3>
              </div>
            </div>
            <Button
                onClick={() => route.push("https://incorporae.com.br/signup")}
                size="lg"
                className="rounded-full self-center text-xl h-auto py-3"
              >
              Quero insights do meu PDF
              </Button>
          </div>
        </div>
      </section>

      <section className="pb-24 lg:pb-32">
      <div className="container !max-w-[65rem] flex  flex-col items-center text-center gap-12 justify-center mx-auto px-4">
      
      <h1 className="text-5xl font-bold uppercase">
            faq
            </h1>
      <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={faq.question}>
                <AccordionTrigger className="text-lg font-semibold text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
