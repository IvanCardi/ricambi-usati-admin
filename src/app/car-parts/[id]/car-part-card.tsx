/* eslint-disable @next/next/no-img-element */
"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CarPart } from "@/lib/models/carPart";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import noImagePlaceholder from "../../../../public/no-image-placeholder.jpg";
import CarPartStatusBadge from "../car-part-status-badge";
import { updateCarPart } from "./actions";

const formSchema = z.object({
  name: z.string().nonempty("Inserire un valore per il nome"),
  description: z.string().nonempty("Inserire un valore per la descrizione"),
  category: z.string().nonempty("Inserisci una categoria"),
  numbers: z
    .array(z.string().nonempty())
    .nonempty("Inserire almeno un numero di parte"),
  warranty: z
    .number({ message: "Inserire un numero" })
    .min(0, "Inserire un numero maggiore o uguale a 0"),
  price: z
    .number({ message: "Inserire un numero" })
    .min(0, "Inserire un numero maggiore o uguale a 0"),
  compatibleCars: z.array(z.string().nonempty()),
});

export default function CarPartCard({ part }: { part: CarPart }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: part.name,
      description: part.description,
      category: part.category,
      numbers: part.numbers,
      compatibleCars: part.compatibleCars ?? [],
      price: part.price,
      warranty: part.warranty,
    },
  });

  const [numbersInputValue, setNumbersInputValue] = useState("");
  const [compatibleCarsInputValue, setCompatibleCarsInputValue] = useState("");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isDirty()) {
      const result = await updateCarPart(part.id, {
        ...values,
        photos: part.photos ?? [],
      });

      if (result.status === "error") {
        toast("Si è verificato un errore", {
          description: result.message,
        });
      } else {
        form.reset(values);
        toast("Componente aggiornato con successo!");
      }
    }
  };

  const isDirty = () => {
    return (
      form.formState.isDirty ||
      (part.compatibleCars.length === 0 &&
        form.getValues("compatibleCars").length !== 0)
    );
  };

  return (
    <Card>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        >
          <CardContent className="flex gap-20 px-20 py-5 items-start">
            <div className="w-[50%] flex flex-col gap-5">
              <Carousel>
                <CarouselContent>
                  {part.photos.length === 0 && (
                    <Image
                      src={noImagePlaceholder}
                      alt="no image placeholder"
                    ></Image>
                  )}
                  {part.photos.map((p) => (
                    <CarouselItem key={p}>
                      <img
                        className="rounded-lg"
                        src={p}
                        alt="product image"
                      ></img>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <div className="flex gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Auto</Label>
                  <Badge>{`${part.carBrand} ${part.carModel} ${part.carSetup}`}</Badge>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Stato</Label>
                  <CarPartStatusBadge status={part.status} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Ultima Modifica</Label>
                  <Badge className="bg-amber-400">{`${moment(
                    part.lastUpdated
                  ).format("HH:mm DD/MM/YYYY")} `}</Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5 w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        /*  disabled={!selectedCar} */
                        {...field}
                        placeholder="Inserisci il nome"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Descrizione</FormLabel>
                    <FormControl>
                      <Textarea
                        /* disabled={!selectedCar} */
                        {...field}
                        placeholder="Inserisci la descrizione"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <Input
                        /*  disabled={!selectedCar} */
                        {...field}
                        placeholder="Inserisci la categoria"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-5 items-start">
                <FormField
                  control={form.control}
                  name="numbers"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Numeri di parte</FormLabel>
                      <FormControl className="flex">
                        <Input
                          placeholder="Inserisci i numeri di parte"
                          /* disabled={!selectedCar} */
                          {...field}
                          value={numbersInputValue}
                          onChange={(e) =>
                            setNumbersInputValue(e.currentTarget.value)
                          }
                          onKeyDown={(e) => {
                            if (e.code === "Enter") {
                              const value = e.currentTarget.value.trim();
                              if (value !== "") {
                                e.preventDefault();
                                e.stopPropagation();
                                form.setValue(
                                  "numbers",
                                  [...form.getValues("numbers"), value],
                                  {
                                    shouldDirty: true,
                                  }
                                );
                                form.clearErrors("numbers");
                                setNumbersInputValue("");
                              }
                            }
                          }}
                        />
                      </FormControl>
                      <div className="flex gap-2 flex-wrap">
                        {form.getValues("numbers").map((num) => (
                          <Badge key={num}>
                            {num}
                            <div>
                              <X
                                size={16}
                                className="cursor-pointer"
                                onClick={() => {
                                  form.setValue(
                                    "numbers",
                                    form
                                      .getValues("numbers")
                                      .filter((n) => n !== num) as [
                                      string,
                                      ...string[]
                                    ],
                                    {
                                      shouldDirty: true,
                                    }
                                  );
                                }}
                              ></X>
                            </div>
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="compatibleCars"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Auto compatibili</FormLabel>
                      <FormControl className="flex">
                        <Input
                          placeholder="Inserisci le auto compatibili"
                          // disabled={!selectedCar}
                          {...field}
                          value={compatibleCarsInputValue}
                          onChange={(e) =>
                            setCompatibleCarsInputValue(e.currentTarget.value)
                          }
                          onKeyDown={(e) => {
                            if (e.code === "Enter") {
                              const value = e.currentTarget.value.trim();
                              if (value !== "") {
                                e.preventDefault();
                                e.stopPropagation();
                                form.setValue(
                                  "compatibleCars",
                                  [...form.getValues("compatibleCars"), value],
                                  {
                                    shouldDirty: true,
                                  }
                                );
                                form.clearErrors("compatibleCars");
                                setCompatibleCarsInputValue("");
                              }
                            }
                          }}
                        />
                      </FormControl>
                      <div className="flex gap-2">
                        {form.getValues("compatibleCars").map((num) => (
                          <Badge key={num}>
                            {num}
                            <div>
                              <X
                                size={16}
                                className="cursor-pointer"
                                onClick={() => {
                                  form.setValue(
                                    "compatibleCars",
                                    form
                                      .getValues("compatibleCars")
                                      .filter((n) => n !== num) as [
                                      string,
                                      ...string[]
                                    ],
                                    {
                                      shouldDirty: true,
                                    }
                                  );
                                }}
                              ></X>
                            </div>
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-5 items-start">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Prezzo</FormLabel>
                      <FormControl>
                        <Input
                          // disabled={!selectedCar}
                          type="number"
                          {...field}
                          placeholder="Inserisci il prezzo"
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="warranty"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Garanzia</FormLabel>
                      <FormControl>
                        <Input
                          // disabled={!selectedCar}
                          type="number"
                          {...field}
                          placeholder="Inserisci la garanzia"
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
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-end w-full">
              <Button type="submit" disabled={!isDirty()}>
                Aggiorna
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
