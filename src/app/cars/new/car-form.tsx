"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createCar } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const formSchema = z.object({
  plate: z.string().nonempty("Inserire un valore per la targa"),
  brand: z.string().nonempty("Inserire un valore per la marca"),
  model: z.string().nonempty("Inserire un valore per il modello"),
  setup: z.string().nonempty("Inserire un valore per l'allestimento"),
  year: z
    .number({ message: "Inserire un numero" })
    .min(2000, "Inserire un numero maggiore di 2000")
    .max(moment().year(), "Inserire un numero minore dell'anno corrente"),
  description: z.string().nonempty("Inserire un valore per la descrizione"),
  kilometers: z
    .number({ message: "Inserire un numero" })
    .min(0, "Inserire un numero maggiore o uguale a 0"),
});

export function CarForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: "",
      model: "",
      setup: "",
      year: 0,
      plate: "",
      description: "",
      kilometers: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await createCar(values);

    if (result.status === "error") {
      toast("Si è verificato un errore", {
        description: result.message,
      });
    } else {
      toast("Macchina aggiunta con successo!");
      router.push("/cars");
    }
  };

  return (
    <Card className="w-[70%] m-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        >
          <CardContent className="flex flex-col gap-5 w-full">
            <div className="w-full flex gap-5 items-start">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem className="w-[40%]">
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Inserisci la marca" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem className="w-[40%]">
                    <FormLabel>Modello</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Inserisci il modello" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem className="w-[20%]">
                    <FormLabel>Anno</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="setup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setup</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Inserisci l'allestimento" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex gap-5 items-start">
              <FormField
                control={form.control}
                name="plate"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Targa</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Inserisci la targa" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kilometers"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Chilometri</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrizione</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Inserisci una breve descrizione del veicolo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Aggiungi</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
