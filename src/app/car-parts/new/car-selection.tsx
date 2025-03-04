import { Check, ChevronsUpDown } from "lucide-react";

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
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Car } from "@/lib/models/car";

export function CarSelection({
  cars,
  selectedCar,
  setSelectedCar,
  disabled,
}: {
  cars: Car[];
  selectedCar: Car | undefined;
  setSelectedCar: (car: Car | undefined) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedCar
            ? `${selectedCar.plate} - ${selectedCar.brand} ${selectedCar.model} ${selectedCar.setup} ${selectedCar.year} `
            : "Seleziona la macchina"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[500px] p-0">
        <Command>
          <CommandInput placeholder="Cerca..." />
          <CommandList>
            <CommandEmpty>Macchina non trovata</CommandEmpty>
            <CommandGroup>
              {cars.map((car) => (
                <CommandItem
                  key={car.id}
                  value={`${car.plate} ${car.brand} ${car.model} ${car.setup} ${car.year}`}
                  onSelect={(currentValue) => {
                    const selectedCarPlate = currentValue.split(" ")[0].trim();

                    if (selectedCarPlate !== selectedCar?.plate) {
                      setSelectedCar(
                        cars.find((c) => c.plate === selectedCarPlate)
                      );
                      setOpen(false);
                    }
                  }}
                >
                  {`${car.plate} - ${car.brand} ${car.model} ${car.setup} ${car.year}`}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedCar === car ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
