/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  useController,
} from "react-hook-form";
import { useMutation } from "react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LucidePlus } from "lucide-react";

import { api } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";
import { toast } from "@/hooks/use-toast";

// --------------------------------------------------
// 1) Define o schema Zod: converte string -> number
// --------------------------------------------------
const createCampaignSchema = z.object({
  nome: z.string().min(1, "O nome da campanha é obrigatório"),
  orcamento: z.coerce.number().min(1, "O orçamento deve ser no mínimo 1"),
  status: z.coerce
    .number()
    .refine((val) => [0, 1, 2].includes(val), {
      message: "Status inválido. Use 0 (inativo), 1 (ativo) ou 2 (pausado).",
    }),
});

type CreateCampaignFormValues = z.infer<typeof createCampaignSchema>;

// Helper para formatar número em moeda PT-BR
function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function CreateCampaignDialog() {
  const [open, setOpen] = useState(false);

  // RHF setup
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CreateCampaignFormValues>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      nome: "",
      orcamento: 0,
      status: 0,
    },
  });

  // useController: campo orcamento (controlado manualmente)
  const { field: orcamentoField, fieldState: orcamentoFieldState } =
    useController({
      name: "orcamento",
      control,
    });

  // Estado local para exibir a string formatada
  const [orcamentoDisplay, setOrcamentoDisplay] = useState("");

  // Ao abrir o dialog, limpamos
  function handleDialogOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      reset(); // reset ao fechar
      setOrcamentoDisplay("");
    }
  }

  // Mutation para criar campanha
  const createCampaignMutation = useMutation({
    mutationFn: async (data: CreateCampaignFormValues) => {
      // data.orcamento está em formato number
      const response = await api.post("/campaing", data);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Campanha criada com sucesso!",
        variant: "default",
      });
      queryClient.invalidateQueries(["campaings"]);
      // Fecha o modal e limpa o form
      setOpen(false);
    },
    onError: (error: any) => {
      // Não fechar o modal em caso de erro
      toast({
        title: "Erro!",
        description:
          error?.response?.data?.error ||
          "Ocorreu um erro inesperado ao criar a campanha.",
        variant: "destructive",
      });
    },
  });

  // Submit final
  function onSubmit(data: CreateCampaignFormValues) {
    // Ex: data.orcamento = 1000 => "1000" no back
    createCampaignMutation.mutate(data);
  }

  // Sempre que o valor em RHF mudar, atualizamos display
  React.useEffect(() => {
    const current = orcamentoField.value;
    if (current && current > 0) {
      setOrcamentoDisplay(formatCurrency(current));
    } else {
      setOrcamentoDisplay("");
    }
  }, [orcamentoField.value]);

  // Lida com o onChange para formatar a digitação
  function handleOrcamentoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = e.target.value.replace(/\D/g, ""); // remove tudo que não for dígito
    let numericValue = 0;

    // Converte para número em reais
    if (rawValue) {
      numericValue = parseFloat(rawValue) / 100; 
    }

    // Seta no RHF (como number)
    orcamentoField.onChange(numericValue);

    // Exibe com máscara
    setOrcamentoDisplay(rawValue ? formatCurrency(numericValue) : "");
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full lg:w-auto">
          <LucidePlus className="mr-2" size={16} /> Criar campanha
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar nova campanha</DialogTitle>
          <DialogDescription>
            Preencha as informações da nova campanha.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* NOME */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="nome">Nome da campanha</Label>
            <Input
              id="nome"
              placeholder="Ex: Promoção de Verão"
              {...register("nome")}
            />
            {errors.nome && (
              <p className="text-sm text-red-500">{errors.nome.message}</p>
            )}
          </div>

          {/* ORÇAMENTO */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="orcamento">Orçamento</Label>
            <Input
              id="orcamento"
              placeholder="R$ 0,00"
              value={orcamentoDisplay}
              onChange={handleOrcamentoChange}
              onBlur={orcamentoField.onBlur}
            />
            {orcamentoFieldState.error && (
              <p className="text-sm text-red-500">
                {orcamentoFieldState.error.message}
              </p>
            )}
          </div>

          {/* STATUS */}
          <div className="flex flex-col space-y-1">
            <Label>Status</Label>
            <Select
              // Carrega valor padrão do form
              defaultValue={String(0)}
              onValueChange={(value) => {
                // Convertemos p/ number e setamos em RHF
                setValue("status", Number(value));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
            
                <SelectItem value="1">Ativo</SelectItem>
                <SelectItem value="0">Inativo</SelectItem>
                <SelectItem value="2">Pausado</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createCampaignMutation.isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createCampaignMutation.isLoading}>
              {createCampaignMutation.isLoading ? "Enviando..." : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
