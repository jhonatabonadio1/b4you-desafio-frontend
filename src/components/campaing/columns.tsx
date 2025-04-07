/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useState } from "react";
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

import { EditCampaignDialog } from "./edit-campaing-dialog";
import { DeleteCampaignDialog } from "./delete-campaing.dialog";

export type Campaing = {
  id: string;
  nome: string;
  status: number;
  orcamento: number;
};

function getCampaingStatus(status: number) {
  let campaingStatus: string;

  switch (status) {
    case 0:
      campaingStatus = "Inativo";
      break;
    case 1:
      campaingStatus = "Ativo";
      break;
    case 2:
      campaingStatus = "Pausado";
      break;
    default:
      campaingStatus = "Inativo";
  }

  return campaingStatus;
}

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
      const raw = row.getValue("orcamento") as number;
      const amount = raw / 100;

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
      <div className="capitalize">{getCampaingStatus(row.getValue("status"))}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Ações",
    cell: ActionsCell,
  },
];

function ActionsCell({ row }: { row: any }) {
  const campaing = row.original as Campaing;
  
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
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

          {/* EDITAR - item normal do dropdown */}
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            Editar campanha
          </DropdownMenuItem>


          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
            Excluir campanha
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    
      <EditCampaignDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        campaign={campaing}
      />

<DeleteCampaignDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        campaingId={campaing.id}
      />
    </>
  );
}
