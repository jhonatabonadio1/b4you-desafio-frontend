import { DropZone } from "./drop-zone";

export function Hero() {
  return (
    <section className="border-grid border-b -mt-14">
      <div className="container-wrapper">
        {/* Hero */}
        <div className="relative overflow-hidden">
          {/* Gradients */}
          <div
            aria-hidden="true"
            className="flex absolute -top-96 start-1/2 transform -translate-x-1/2"
          >
            <div className="bg-gradient-to-r from-background/50 to-background blur-3xl w-[25rem] h-[44rem] rotate-[-60deg] transform -translate-x-[10rem]" />
            <div className="bg-gradient-to-tl blur-3xl w-[90rem] h-[50rem] rounded-full origin-top-left -rotate-12 -translate-x-[15rem] from-primary-foreground via-primary-foreground to-background" />
          </div>
          {/* End Gradients */}
          <div className="relative z-10 mt-14">
            <div className="container py-14 md:py-10 lg:py-24">
              <div className="max-w-2xl text-center mx-auto mb-6">
                <div className="max-w-2xl flex flex-col gap-6 items-center">
               
                  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Tenha Insights dos Seus PDFs em Tempo Real
                  </h1>
                </div>
                {/* End Title */}
                <div className="mt-5 max-w-3xl">
                  <p className="text-xl text-muted-foreground">
                  Faça o upload em um servidor seguro e otimizado, acompanhe acessos, interações e descubra como seu público engaja com seus documentos e apresentações. 
                  </p>
                </div>
                {/* Buttons */}

                {/* End Buttons */}
              </div>
              <div className="mx-auto">
                <DropZone />
              </div>
            </div>
          </div>
        </div>
        {/* End Hero */}
      </div>
    </section>
  );
}
