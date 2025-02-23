import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { Progress } from "./ui/progress";
import { useStorage } from "@/services/hooks/storage";
import { PlanSelect } from "./plan-select";
import { useState } from "react";

export default function Storage() {
  // 🔥 Hook para buscar os dados de armazenamento
  const { data, isLoading } = useStorage();

  // 🔥 Valores calculados
  const totalUsed = data?.totalUsed || 0; // Espaço já utilizado (em bytes)
  const totalLimit = data?.totalLimit || 0; // 50MB em bytes
  const usedPercentage = Math.min((totalUsed / totalLimit) * 100, 100); // Evita valores acima de 100%

  const [changePlanModalIsOpen, setChangePlanModalIsOpen] = useState(false);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 sm:flex sm:justify-center sm:px-6 sm:pb-5 lg:px-8">
        <div className="pointer-events-auto flex items-center justify-between gap-x-6 bg-primary px-6 py-2.5 sm:rounded-xl sm:py-3 sm:pl-4 sm:pr-3.5">
          <div className="flex flex-col gap-1 text-sm leading-6 text-primary-foreground w-full lg:w-[400px]">
            <span className="font-semibold">Armazenamento</span>

            {/* 🔥 Barra de progresso dinâmica */}
            <Progress value={isLoading ? 0 : usedPercentage} />

            <div className="flex items-center w-full justify-between">
              <span className="self-start text-xs">
                Utilizado:{" "}
                <span className="font-bold">
                  {isLoading ? "..." : (totalUsed / 1024) > 1000 ? (totalUsed / 1024).toFixed(2).charAt(0) + " GB" : (totalUsed / 1024).toFixed(2) + " MB"}
                </span>
              </span>
              <span className="self-end text-xs">
                Max.{" "}
                <span className="font-bold">
                {(totalLimit / 1024) > 1000 ? (totalLimit / 1024).toFixed(2).charAt(0) + " GB" : (totalLimit / 1024).toFixed(2) + " MB"}
                </span>
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setChangePlanModalIsOpen(true)}
            className="flex items-center gap-x-1"
          >
            Upgrade <Rocket className="h-4 w-4" />
          </Button>
        </div>

        <PlanSelect
          isOpen={changePlanModalIsOpen}
          onChange={setChangePlanModalIsOpen}
        />
      </div>
    </>
  );
}
