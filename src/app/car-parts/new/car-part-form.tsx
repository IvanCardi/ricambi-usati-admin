/* eslint-disable @next/next/no-img-element */
"use client";

import { Badge } from "@/components/ui/badge";
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
import { Car } from "@/lib/models/car";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleX, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CarSelection } from "./car-selection";
import { createCarPart } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import TechnicalDetails from "@/components/technical-details";

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
    .min(1, "Inserire un numero maggiore a 0"),
  compatibleCars: z.array(z.string().nonempty()),
  photos: z.array(z.any()),
  adHocShippingCosts: z.number().optional(),
});

export function CarPartForm({
  cars,
  selectedCarId,
}: {
  cars: Car[];
  selectedCarId: string | undefined;
}) {
  const router = useRouter();

  const [selectedCar, setSelectedCar] = useState<Car | undefined>(
    selectedCarId ? cars.find((c) => c.id === selectedCarId) : undefined
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      numbers: [],
      compatibleCars: [],
      price: 0,
      warranty: 0,
      photos: [],
      adHocShippingCosts: 0,
    },
  });

  const [numbersInputValue, setNumbersInputValue] = useState("");
  const [compatibleCarsInputValue, setCompatibleCarsInputValue] = useState("");
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [techDetails, setTechDetails] = useState<
    { id: string; label: string; value: string }[]
  >([]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (selectedCar) {
      const result = await createCarPart({
        ...values,
        adHocShippingCosts:
          values.adHocShippingCosts === 0
            ? undefined
            : values.adHocShippingCosts,
        carId: selectedCar?.id ?? "",
        technicalDetails: techDetails.filter(
          (td) => td.value && td.label && td.value !== "" && td.label !== ""
        ),
      });

      if (result.status === "error") {
        toast("Si è verificato un errore", {
          description: result.message,
        });
      } else {
        toast("Componente aggiunto con successo!");
        router.push("/car-parts");
      }
    }
  };

  return (
    <Card className="w-[70%] m-auto">
      <div className="w-full flex flex-col gap-5">
        <div className="w-full px-6">
          <CarSelection
            cars={cars}
            selectedCar={selectedCar}
            setSelectedCar={setSelectedCar}
            disabled={
              !!selectedCarId && !!cars.find((c) => c.id === selectedCarId)
            }
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            className="flex flex-col gap-5 w-full"
          >
            <CardContent className="flex flex-col gap-5 w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        disabled={!selectedCar}
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
                        disabled={!selectedCar}
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
                        disabled={!selectedCar}
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
                          disabled={!selectedCar}
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
                                form.setValue("numbers", [
                                  ...form.getValues("numbers"),
                                  value,
                                ]);
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
                                    ]
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
                          disabled={!selectedCar}
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
                                form.setValue("compatibleCars", [
                                  ...form.getValues("compatibleCars"),
                                  value,
                                ]);
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
                                    ]
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
                          disabled={!selectedCar}
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
                          disabled={!selectedCar}
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
                <FormField
                  control={form.control}
                  name="adHocShippingCosts"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Spese di spedizione dedicate</FormLabel>
                      <FormControl>
                        <Input
                          disabled={!selectedCar}
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
              </div>
              <FormField
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
              />
              <TechnicalDetails
                details={techDetails}
                setDetails={setTechDetails}
                isDisabled={!selectedCar}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit">Aggiungi</Button>
            </CardFooter>
          </form>
        </Form>
      </div>
    </Card>
  );
}
