import { useQuery, useMutation, useQueryClient } from "react-query";
import { api } from "@/services/apiClient";

export function useFiles(search?: string) {
  return useQuery(["files", search], async () => {
    // Envia o termo de busca como query param
    let response;

    if (search) {
      response = await api.get("/files", { params: { search } });
    } else {
      response = await api.get("/files");
    }

    // A resposta: { success: true, data: [...] }
    // return response.data.data;Precisamos retornar o array real de dados:
    return response.data.data;
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Retorna { title, sizeInBytes, ... }
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("files");
        queryClient.invalidateQueries("storage");
      },
    }
  );
}

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation(
    async (docId: string) => {
      await api.delete(`/files/${docId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("files");
        queryClient.invalidateQueries("storage");
      },
    }
  );
}
