import { useQuery } from "react-query";
import { api } from "@/services/apiClient";

// 🔥 Função que busca os dados de armazenamento da API
const fetchStorage = async () => {
  const { data } = await api.get("/storage");
  return data;
};

// 🔥 Hook para consumir os dados e atualizar automaticamente
export function useStorage() {
  return useQuery("storage", fetchStorage, {
    staleTime: 1000 * 60 * 5, // 5 minutos antes de refazer a busca
  });
}
