"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CarPartStatusBadge from "../car-part-status-badge";

const formSchema = z.object({
  name: z.string().nonempty("Inserire un valore per il nome"),
  description: z.string().nonempty("Inserire un valore per la descrizione"),
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
      console.log(values);
    }
    /* if (selectedCar) {
        const result = await createCarPart({
          ...values,
          carId: selectedCar?.id ?? "",
          category: "Motore",
        });
  
        if (result.status === "error") {
          toast("Si è verificato un errore", {
            description: result.message,
          });
        } else {
          toast("Componente aggiunto con successo!");
          router.push("/car-parts");
        }
      } */
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
      <CardContent className="flex gap-20 px-20 py-5">
        <div className="w-[50%] flex flex-col gap-5">
          <Carousel>
            <CarouselContent>
              {part.photos.map((p) => (
                <CarouselItem key={p}>
                  <img className="rounded-lg" src={p}></img>
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
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            className="flex flex-col gap-5 w-full m-auto"
          >
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
            {/* <FormField
              control={form.control}
              name="photos"
              render={() => (
                <FormItem className="w-full">
                  <FormLabel>Foto</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!selectedCar}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        form.setValue("photos", files);
                        setPhotoPreviews(
                          files.map((file) => URL.createObjectURL(file))
                        );
                      }}
                    />
                  </FormControl>
                  <div className="flex gap-2 flex-wrap">
                    {photoPreviews.map((src, index) => (
                      <div key={src} className="relative ">
                        <img
                          src={src}
                          alt={`Preview ${src}`}
                          height={96}
                          width={96}
                          className="rounded-lg w-24 h-24 border object-cover"
                        />
                        <div className="absolute top-[-5px] right-[-5px]">
                          <CircleX
                            size={18}
                            className="cursor-pointer bg-white rounded-full"
                            onClick={() => {
                              form.setValue(
                                "photos",
                                form.getValues("photos").toSpliced(index, 1)
                              );
                              setPhotoPreviews((curr) =>
                                curr.toSpliced(index, 1)
                              );
                            }}
                          ></CircleX>
                        </div>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <div className="flex justify-end">
              <Button type="submit" disabled={!isDirty()}>
                Aggiorna
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
