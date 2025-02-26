 
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import CookieConsent from "react-cookie-consent";

import { PricingSectionCards } from "@/components/pricing-section-cards";
import { Hero } from "@/components/hero";
import { IconSectionStackedCards } from "@/components/icon-section-stacked";
import { Faq } from "@/components/faq";
import Head from "next/head";
import Intercom from '@intercom/messenger-js-sdk';

export default function Home() {

  Intercom({
    app_id: 'qur8i35e',
  });
 


  return (
    <>
      <Head>
        <title>
          Faça upload de seus PDFs e incorpore em seu site - Incorporae!
        </title>
      </Head>
      <div data-wrapper="" className="border-grid flex flex-1 flex-col">
        <SiteHeader />

        <main className="flex flex-1 flex-col">
          <Hero />

          <IconSectionStackedCards />
          <PricingSectionCards />

          <Faq />

          <section className="border-grid border-b -mt-14">
            <div className="container-wrapper">
              <div className="max-w-[85rem] container py-24 lg:py-32">
                <div className="max-w-4xl mx-auto space-y-6">
                  <h1 className="text-3xl font-bold text-left">
                    Incorporaê – A Solução Completa para Incorporar PDFs e
                    Rastrear Leituras
                  </h1>

                  <p className="text-lg text-primary">
                    Se você precisa compartilhar documentos de forma
                    profissional e acompanhar seu desempenho, o{" "}
                    <strong>Incorporaê</strong> é a plataforma perfeita para
                    você. Com ele, você pode{" "}
                    <strong>fazer upload de PDFs</strong>,{" "}
                    <strong>incorporar PDFs em seu site via iframe</strong> e
                    obter <strong>insights avançados</strong> sobre
                    <strong> quantos usuários leram seu documento</strong>, tudo
                    de maneira prática e intuitiva.
                  </p>

                  <p className="text-lg text-primary">
                    Muitas empresas, profissionais de marketing, educadores e
                    criadores de conteúdo enfrentam desafios ao distribuir
                    materiais digitais sem perder o controle sobre seu uso. O{" "}
                    <strong>Incorporaê</strong> resolve esse problema oferecendo
                    não apenas um meio simples para exibir documentos, mas
                    também uma poderosa ferramenta de rastreamento e análise.
                  </p>

                  <h2 className="text-2xl font-semibold mt-6">
                    📌 Principais Funcionalidades do Incorporaê
                  </h2>

                  <ul className="space-y-4">
                    <li className="p-4 bg-transparent text-primary border border-grid rounded-lg">
                      <strong>✅ Upload de PDF fácil e rápido:</strong> Envie
                      seus arquivos para a nuvem com segurança e obtenha um link
                      de incorporação imediato.
                    </li>
                    <li className="p-4 bg-transparent text-primary border border-grid rounded-lg">
                      <strong>✅ Incorporar PDF em seu site via iframe:</strong>{" "}
                      Exiba seus PDFs sem redirecionar visitantes, garantindo
                      retenção e engajamento.
                    </li>
                    <li className="p-4 bg-transparent text-primary border border-grid rounded-lg">
                      <strong>✅ Quanto usuários leram meu documento?</strong>{" "}
                      Obtenha estatísticas precisas sobre visualizações, tempo
                      de leitura e engajamento.
                    </li>
                    <li className="p-4 bg-transparent text-primary border border-grid rounded-lg">
                      <strong>✅ Insights avançados de PDF:</strong> Descubra
                      quais páginas são mais visualizadas e onde os leitores
                      perdem o interesse.
                    </li>
                    <li className="p-4 bg-transparent text-primary border border-grid rounded-lg">
                      <strong>✅ Mapa de calor PDF:</strong> Visualize as áreas
                      do documento que receberam mais atenção com mapas de calor
                      interativos.
                    </li>
                    <li className="p-4 bg-transparent text-primary border border-grid rounded-lg">
                      <strong>✅ Usuários lendo meu PDF em tempo real:</strong>{" "}
                      Veja quando, de onde e em quais dispositivos seus leitores
                      acessam seu documento.
                    </li>
                    <li className="p-4 bg-transparent text-primary border border-grid rounded-lg">
                      <strong>✅ Como saber quem leu meu PDF?</strong> Controle
                      o acesso aos seus documentos e identifique quem visualizou
                      cada arquivo.
                    </li>
                  </ul>

                  <h2 className="text-2xl font-semibold mt-6">
                    💡 Por que escolher o Incorporaê?
                  </h2>

                  <ul className="space-y-4">
                    <li className="p-4 bg-transparent text-primary border border-grid rounded-lg">
                      🔹 <strong>Fácil de usar</strong> – Upload, incorporação e
                      análise de PDFs com poucos cliques.
                    </li>
                    <li className="p-4 bg-transparent text-primary border border-grid rounded-lg">
                      🔹 <strong>Análises detalhadas</strong> – Tenha acesso a
                      métricas valiosas sobre seus leitores.
                    </li>
                    <li className="p-4 bg-transparent text-primary border border-grid rounded-lg">
                      🔹 <strong>Mais engajamento</strong> – Mantenha os
                      visitantes no seu site sem precisar de downloads.
                    </li>
                    <li className="p-4 bg-transparent text-primary border border-grid rounded-lg">
                      🔹 <strong>Privacidade e segurança</strong> – Seus
                      documentos ficam protegidos e acessíveis apenas para quem
                      você permitir.
                    </li>
                    <li className="p-4 bg-transparent text-primary border border-grid rounded-lg">
                      🔹 <strong>Melhor experiência do usuário</strong> – PDFs
                      responsivos para desktops e dispositivos móveis.
                    </li>
                  </ul>

                  <h2 className="text-2xl font-semibold mt-6">
                    🎯 Quem pode se beneficiar do Incorporaê?
                  </h2>

                  <ul className="space-y-4">
                    <li className="p-4 bg-transparent text-primary border border-grid rounded-lg">
                      📌 <strong>Empresas e times de vendas</strong> – Monitore
                      propostas comerciais e documentos enviados para clientes.
                    </li>
                    <li className="p-4 bg-transparent text-primary border border-grid rounded-lg">
                      📌 <strong>Professores e educadores</strong> – Descubra se
                      seus alunos acessaram e estudaram o material didático.
                    </li>
                    <li className="p-4 bg-transparent text-primary border border-grid rounded-lg">
                      📌 <strong>Escritórios jurídicos</strong> – Controle quem
                      leu contratos e documentos legais.
                    </li>
                    <li className="p-4 bg-transparent text-primary border border-grid rounded-lg">
                      📌 <strong>Criadores de conteúdo</strong> – Acompanhe o
                      desempenho de e-books e relatórios.
                    </li>
                    <li className="p-4 bg-transparent text-primary border border-grid rounded-lg">
                      📌 <strong>Agências de marketing</strong> – Analise como
                      materiais promocionais e informativos são consumidos.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <SiteFooter />
        <CookieConsent
          cookieName="incorporae-cookies"
          expires={150}
          location="bottom"
          buttonText="Eu entendo"
          containerClasses="!bg-foreground !text-background"
          buttonClasses="!bg-background !text-foreground !rounded-lg !inline-flex !items-center !justify-center !gap-2 !whitespace-nowrap !rounded-md !text-sm !font-medium !transition-colors !focus-visible:outline-none !focus-visible:ring-1 !focus-visible:ring-ring !disabled:pointer-events-none !disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        >
          Este site usa cookies para melhorar a experiência do usuário.
        </CookieConsent>
      </div>
    </>
  );
}
