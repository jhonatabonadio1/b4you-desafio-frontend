import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "O que é o Incorporae?",
    answer:
      "O Incorporae é uma plataforma que permite a incorporação de documentos PDF em sites e aplicativos de forma fácil e segura, oferecendo opções avançadas de personalização e controle de acesso.",
  },
  {
    question: "Como faço para incorporar um PDF no meu site?",
    answer:
      "Após o upload do seu arquivo PDF na plataforma Incorporae, você receberá um link de incorporação (iframe) que pode ser adicionado ao seu site com apenas algumas linhas de código.",
  },
  {
    question: "O Incorporae é compatível com todos os navegadores?",
    answer:
      "Sim, nossos embeds são compatíveis com todos os navegadores modernos, incluindo Google Chrome, Firefox, Safari e Edge.",
  },
  {
    question: "Posso restringir o acesso ao meu documento?",
    answer:
      "Sim! O Incorporae permite definir restrições de acesso, como proteção por senha e restrição de visualização para domínios específicos.",
  },
  {
    question: "O Incorporae oferece estatísticas de visualização?",
    answer:
      "Sim, nossa plataforma fornece relatórios detalhados sobre o número de visualizações, tempo médio de leitura e interações com o documento.",
  },
  {
    question: "Existe uma versão gratuita do Incorporae?",
    answer:
      "Sim, oferecemos um plano gratuito com funcionalidades básicas. Para recursos avançados, é possível optar por um dos nossos planos pagos.",
  }
];

export function Faq() {
  return (
      <section className="border-grid border-b -mt-14">
    <div className="container-wrapper">
      <div className="max-w-[85rem] container py-24 lg:py-32">
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <h2 className="text-2xl font-bold md:text-4xl md:leading-tight">
            Perguntas Frequentes
          </h2>
          <p className="mt-1 text-muted-foreground">
            Respondemos as dúvidas mais comuns sobre o Incorporae.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
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
      </div>
    </div>
    </section>
  );
}
