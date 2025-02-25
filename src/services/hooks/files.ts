import { useQuery, useMutation, useQueryClient } from "react-query";
import { api } from "@/services/apiClient";
import axios from "axios";


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


  return useMutation(async (file: File) => {
    // 1) Pedir presigned URL
    const fileName = file.name;
    const fileType = file.type;
    const sizeInBytes = file.size;
    const userId = "123"; // Exemplo fixo; substitua com ID real

    const presignRes = await api.post("/file/presign", {
      fileName,
      fileType,
      userId,
      sizeInBytes,
    });

    const { uploadUrl, key } = presignRes.data;

    // 2) Upload direto ao S3
    // Importante: usar PUT com cabeçalho "Content-Type"
    await axios.put(uploadUrl, file, {
      headers: {
       'Content-Type': 'application/pdf'
      },
    });


    // 3) Notificar backend que o upload foi concluído
    const completeRes = await api.post("/file/complete", {
      key,
      originalName: fileName,
      sizeInBytes,
      userId,
    });

    queryClient.invalidateQueries("storage");
    return completeRes.data;
  });
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
