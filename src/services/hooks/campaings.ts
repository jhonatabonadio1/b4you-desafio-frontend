import { useQuery } from "react-query";
import { api } from "@/services/apiClient";

export function useCampaings(search?: string) {
  return useQuery(["campaing", search], async () => {
   
    let response;

    if (search) {
      response = await api.get("/campaing");
    } else {
      response = await api.get("/campaing");
    }

    return response.data.data;
  });
}
