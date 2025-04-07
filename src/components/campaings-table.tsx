"use client";

import { columns, Campaing } from "./campaing/columns";
import { DataTable } from "./campaing/data-table";
import { useCampaing } from "@/services/hooks/useCampaing";

export function CampaingsTable() {
  // Busca as campanhas
  const { data, isLoading, isError } = useCampaing();

  if (isLoading) {
    return <p>Carregando campanhas...</p>;
  }

  if (isError) {
    return <p className="text-red-500">Erro ao buscar campanhas.</p>;
  }

  if (!data || data.length === 0) {
    return <p>Nenhuma campanha encontrada.</p>;
  }

  return <DataTable columns={columns} data={data as unknown as Campaing[]} />;
}
