"use client";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/apiClient";

export interface Campaing {
  id: string;
  nome: string;
  status: "inativo" | "ativo" | "pausado";
  orcamento: number;
}

async function fetchCampaings(): Promise<Campaing[]> {
  const { data } = await api.get("/campaing");
  return data;
}

async function deleteCampaing(id: string): Promise<void> {
  await api.delete(`/campaing/${id}`);
}

export function useCampaing() {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery(["campaings"], fetchCampaings);

  const {
    mutate: deleteCampaign,
    isLoading: isDeleting,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation(deleteCampaing, {
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Campanha excluída com sucesso.",
      });

      queryClient.invalidateQueries(["campaings"]);
    },
    onError: () => {
      toast({
        title: "Erro!",
        description: "Não foi possível excluir a campanha.",
        variant: "destructive",
      });
    },
  });

  return {
    data,         
    isLoading,   
    isError,
    error,
    deleteCampaign,
    isDeleting,
    isDeleteError,
    deleteError,
  };
}
