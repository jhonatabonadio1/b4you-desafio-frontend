/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useEffect, useState } from "react";
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

import { api } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";
import { toast } from "@/hooks/use-toast";

// 1) Zod schema
const editCampaignSchema = z.object({
  nome: z.string().min(1, "O nome da campanha é obrigatório"),
  orcamento: z.coerce.number().min(1, "O orçamento deve ser no mínimo 1"),
  status: z.coerce.number().refine((val) => [0, 1, 2].includes(val), {
    message: "Status inválido. Use 0, 1 ou 2",
  }),
});
type EditCampaignFormValues = z.infer<typeof editCampaignSchema>;

// 2) Formata número em moeda
function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// 3) Tipo local de Campanha
export interface Campaign {
  id: string;
  nome: string;
  orcamento: number; // Se vier em centavos, ex: 20000 => R$ 200,00
  status: number; // 0,1,2
}

interface EditCampaignDialogProps {
  open: boolean; // controlado externamente
  onOpenChange: (open: boolean) => void; // callback p/ fechar
  campaign: Campaign;
}

export function EditCampaignDialog({
  open,
  onOpenChange,
  campaign,
}: EditCampaignDialogProps) {
  // ---------------------------
  // React Hook Form
  // ---------------------------
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<EditCampaignFormValues>({
    resolver: zodResolver(editCampaignSchema),
    defaultValues: {
      nome: "",      // será sobrescrito no reset()
      orcamento: 0,  // idem
      status: 0,     // idem
    },
  });

  // Controller do orçamento (para máscara)
  const { field: orcamentoField, fieldState: orcamentoFieldState } =
    useController({
      name: "orcamento",
      control,
    });

  // Estado local só para exibir a string formatada do orçamento
  const [orcamentoDisplay, setOrcamentoDisplay] = useState("");

  // Observa o status do formulário
  const watchStatus = watch("status");

  // Ao abrir o diálogo, resetamos os valores do form
  useEffect(() => {
    if (open) {
      // Dividir por 100 se o backend retorna centavos
      const orcamentoEmReais = campaign.orcamento / 100;

      reset({
        nome: campaign.nome,
        orcamento: orcamentoEmReais,
        status: campaign.status,
      });

      // Atualiza display do orçamento
      if (orcamentoEmReais > 0) {
        setOrcamentoDisplay(formatCurrency(orcamentoEmReais));
      } else {
        setOrcamentoDisplay("");
      }
    }
  }, [open, campaign, reset]);

  // ---------------------------
  // useMutation para PUT
  // ---------------------------
  const editCampaignMutation = useMutation({
    mutationFn: async (data: EditCampaignFormValues) => {
      // Lembre de multiplicar por 100 se o backend espera centavos
      // ou envie data.orcamento como float mesmo, conforme sua API
      // Exemplo: "Enviar orcamento em centavos"
      const payload = {
        ...data,
        orcamento: data.orcamento,
      };

      const response = await api.put(`/campaing/${campaign.id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Campanha atualizada com sucesso!",
      });
      queryClient.invalidateQueries(["campaings"]);
      onOpenChange(false); // fecha modal
    },
    onError: (error: any) => {
      toast({
        title: "Erro!",
        description:
          error?.response?.data?.error ||
          "Ocorreu um erro inesperado ao atualizar a campanha.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: EditCampaignFormValues) {
    // data.status => 0|1|2
    // data.orcamento => float (ex: 200.0)
    editCampaignMutation.mutate(data);
  }

  // Quando o valor do orcamento no form muda, refaz a máscara
  useEffect(() => {
    if (orcamentoField.value > 0) {
      setOrcamentoDisplay(formatCurrency(orcamentoField.value));
    } else {
      setOrcamentoDisplay("");
    }
  }, [orcamentoField.value]);

  // Lida com a digitação do usuário no campo Orçamento
  function handleOrcamentoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = e.target.value.replace(/\D/g, "");
    let numericValue = 0;
    if (rawValue) {
      numericValue = parseFloat(rawValue) / 100; // converte para reais
    }
    orcamentoField.onChange(numericValue);
    setOrcamentoDisplay(rawValue ? formatCurrency(numericValue) : "");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Campanha</DialogTitle>
          <DialogDescription>
            Altere as informações da campanha.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* NOME */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="nome">Nome da campanha</Label>
            <Input
              id="nome"
              placeholder="Ex: Promoção de Inverno"
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
              // Observa o status do form e converte number -> string
              value={String(watchStatus)}
              onValueChange={(value) => {
                setValue("status", Number(value));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Inativo</SelectItem>
                <SelectItem value="1">Ativo</SelectItem>
                <SelectItem value="2">Pausado</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={editCampaignMutation.isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={editCampaignMutation.isLoading}>
              {editCampaignMutation.isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
