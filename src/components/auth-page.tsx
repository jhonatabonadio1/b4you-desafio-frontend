/* eslint-disable react-hooks/exhaustive-deps */
import { Icons } from "@/components/icons";
import { IOptions, RecursivePartial } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from "next-themes";

import Link from "next/link";
import { ReactNode, useEffect, useMemo, useState } from "react";

interface Props {
  render: ReactNode;
}

export default function AuthPage({ render }: Props) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const {  resolvedTheme } = useTheme()


  const options = useMemo<RecursivePartial<IOptions>>(
    () => ({
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: resolvedTheme=== "dark" ? "#999" : "#777",
        },
        links: {
          color:  resolvedTheme=== "dark" ? "#999" : "#777",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 1.5,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 80,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    <>
      <div className="relative flex items-center min-h-screen bg-gradient-to-bl from-primary-foreground via-background to-background">
        {init && (
          <Particles
            id="tsparticles"
            options={options}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 0, 
            }}
          />
        )}

        <div className="container py-24 sm:py-32 relative z-10">
          <div className="grid items-center md:grid-cols-2 gap-8 lg:gap-12">
            <div className="flex flex-col gap-3">
              <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
                <Icons.logoFull className="h-auto w-32 mb-2" />
              </Link>

              <div className="mt-4 md:mb-12 max-w-2xl">
                <h1 className="mb-8 scroll-m-20 text-4xl font-semibold tracking-wide lg:text-5xl">
                  Venda mais. Gerencie com inteligência. Escale com a força dos
                  creators.
                </h1>
                <p className="text-xl text-muted-foreground">
                  A B4YOU é a plataforma definitiva para marcas que querem
                  potencializar as vendas, ter total controle da operação e
                  escalar com creators afiliados.
                </p>
              </div>
            </div>

            <div>
              {render}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
