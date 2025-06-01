// components/ui/multi-select.tsx

"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Pilih...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const clearAll = () => onChange([]);

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="truncate">
              {selected.length === 0
                ? placeholder
                : `${selected.length} dipilih`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Cari label..." />
            <CommandEmpty>Label tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  onSelect={() => toggle(opt.value)}
                  className="cursor-pointer"
                >
                  <div
                    className={cn(
                      "mr-2 h-4 w-4 rounded-sm border border-primary",
                      selected.includes(opt.value)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50"
                    )}
                  >
                    {selected.includes(opt.value) && (
                      <Check className="h-4 w-4" />
                    )}
                  </div>
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selected.map((value) => {
            const opt = options.find((o) => o.value === value);
            return (
              <Badge key={value} variant="secondary" className="flex items-center gap-1">
                {opt?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggle(value)}
                />
              </Badge>
            );
          })}
          <Button variant="link" size="sm" className="px-1" onClick={clearAll}>
            Hapus semua
          </Button>
        </div>
      )}
    </div>
  );
}
