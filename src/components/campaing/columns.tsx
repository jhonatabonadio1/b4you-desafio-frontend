"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,

  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Campaing = {
  id: string;
  nome: string;
  status: "inativo" | "ativo" | "pausado";
  orcamento: number;
};

export const columns: ColumnDef<Campaing>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
    cell: ({ row }) => <div className="capitalize">{row.getValue("nome")}</div>,
  },
  {
    accessorKey: "orcamento",
    header: () => <div className="text-right">Orçamento</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("orcamento")) / 100;

      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    header: "Ações",
    cell: ({ row }) => {
      const campaing = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button >
              Opções <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
          
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(campaing.id)}
            >
              Copiar ID da campanha
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Editar campanha</DropdownMenuItem>
            <DropdownMenuItem>Excluir campanha</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
