"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCampaing } from "@/services/hooks/useCampaing";

interface DeleteCampaignDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  campaingId: string;
}

export function DeleteCampaignDialog({
  open,
  onOpenChange,
  campaingId,
}: DeleteCampaignDialogProps) {
  const { deleteCampaign, isDeleting } = useCampaing();

  function handleConfirmDelete() {
    deleteCampaign(campaingId);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Campanha</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja excluir esta campanha?
            <br />
            Essa ação não poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
