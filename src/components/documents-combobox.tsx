"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";


interface Props {
  data: {
    value: string;
    label: string;
  }[];
  onChange: (docId: string) => void;
  value: string;
}

export function DocumentsCombobox({ data, value, onChange }: Props) {
  const [open, setOpen] = React.useState(false);
 

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full max-w-screen lg:w-[300px] justify-between"
        >
          <span className="truncate">{value
            ? data.find((framework) => framework.value === value)?.label
            : "Selecione um documento..."} </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-screen lg:w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar ..." />
          <CommandList>
            <CommandEmpty>Nenhum documento encontrado.</CommandEmpty>
            <CommandGroup>
              {data.map((framework) => (
                <CommandItem
                  key={framework.value}
                  
                  value={framework.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 ",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate max-w-full">{framework.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
