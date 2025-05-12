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
import { CircleX, X } from "lucide-react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import noImagePlaceholder from "../../../../public/no-image-placeholder.jpg";
import CarPartStatusBadge from "../car-part-status-badge";
import { deleteCarPart, updateCarPart } from "./actions";
import { useRouter } from "next/navigation";

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
  adHocShippingCosts: z.number().optional(),
});

export default function CarPartCard({ part }: { part: CarPart }) {
  const router = useRouter();

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
      adHocShippingCosts: part.adHocShippingCosts ?? 0,
    },
  });

  const [numbersInputValue, setNumbersInputValue] = useState("");
  const [compatibleCarsInputValue, setCompatibleCarsInputValue] = useState("");
  const [currentPhotos, setCurrentPhotos] = useState(part.photos);
  const addPhotosRef = useRef<HTMLInputElement>(null);
  const [newlyAddedPhotos, setNewlyAddedPhotos] = useState<File[]>([]);
  const [newlyAddedPhotoPreviews, setNewlyAddedPhotoPreviews] = useState<
    string[]
  >([]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isDirty()) {
      const result = await updateCarPart(
        part.id,
        {
          ...values,
          photos: currentPhotos,
        },
        newlyAddedPhotos
      );

      if (result.status === "error") {
        toast("Si è verificato un errore", {
          description: result.message,
        });
      } else {
        form.reset(values);
        setNewlyAddedPhotoPreviews([]);
        setNewlyAddedPhotos([]);
        toast("Componente aggiornato con successo!");
      }
    }
  };

  const onDelete = async () => {
    const result = await deleteCarPart(part.id);

    if (result.status === "error") {
      toast("Si è verificato un errore", {
        description: result.message,
      });
    } else {
      router.push("/car-parts");
    }
  };

  const isDirty = () => {
    return (
      form.formState.isDirty ||
      (part.compatibleCars.length === 0 &&
        form.getValues("compatibleCars").length !== 0) ||
      part.photos.length !== currentPhotos.length ||
      newlyAddedPhotos.length > 0
    );
  };

  const removePhoto = (url: string, index: number) => {
    setCurrentPhotos((curr) => curr.filter((ph) => ph !== url));
    setNewlyAddedPhotoPreviews((curr) => curr.filter((ph) => ph !== url));
    setNewlyAddedPhotos((curr) =>
      curr.filter((_, i) => i !== index - currentPhotos.length)
    );
  };

  useEffect(() => {
    setCurrentPhotos(part.photos);
  }, [part.photos]);

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
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <div className="w-full max-w-[500px] mx-auto">
                  <Carousel>
                    <CarouselContent>
                      {[...currentPhotos, ...newlyAddedPhotoPreviews].length ===
                        0 && (
                        <CarouselItem className="flex justify-center items-center">
                          <div className="relative w-full h-[300px] flex items-center justify-center bg-[#dfeaf0] rounded-lg overflow-hidden">
                            <img
                              src={noImagePlaceholder.src}
                              alt={`No image placeholder`}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        </CarouselItem>
                      )}
                      {[...currentPhotos, ...newlyAddedPhotoPreviews].map(
                        (src, index) => (
                          <CarouselItem
                            key={src + index}
                            className="flex justify-center items-center"
                          >
                            <div className="relative w-full h-[300px] flex items-center justify-center bg-[#dfeaf0] rounded-lg overflow-hidden">
                              <img
                                src={src}
                                alt={`Image ${index}`}
                                className="max-w-full max-h-full object-contain"
                              />
                              {part.status !== "sold" && (
                                <CircleX
                                  className="size-4 absolute top-0 right-0 cursor-pointer"
                                  onClick={() => {
                                    removePhoto(src, index);
                                  }}
                                ></CircleX>
                              )}
                            </div>
                          </CarouselItem>
                        )
                      )}
                    </CarouselContent>
                    <CarouselPrevious type="button" />
                    <CarouselNext type="button" />
                  </Carousel>
                </div>
                {part.status !== "sold" && (
                  <div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      ref={addPhotosRef}
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setNewlyAddedPhotos(files);
                        setNewlyAddedPhotoPreviews(
                          files.map((file) => URL.createObjectURL(file))
                        );
                      }}
                    />
                    <Button
                      type="button"
                      size={"sm"}
                      onClick={() => addPhotosRef.current?.click()}
                    >
                      Carica Immagini
                    </Button>
                  </div>
                )}
              </div>
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
                        {...field}
                        disabled={part.status === "sold"}
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
                        {...field}
                        disabled={part.status === "sold"}
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
                        {...field}
                        disabled={part.status === "sold"}
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
                          {...field}
                          disabled={part.status === "sold"}
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
                            {part.status !== "sold" && (
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
                            )}
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
                          {...field}
                          disabled={part.status === "sold"}
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
                            {part.status !== "sold" && (
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
                            )}
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
                          type="number"
                          {...field}
                          disabled={part.status === "sold"}
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
                          type="number"
                          {...field}
                          disabled={part.status === "sold"}
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
                          type="number"
                          {...field}
                          disabled={part.status === "sold"}
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
            </div>
          </CardContent>
          <CardFooter>
            {part.status !== "sold" && (
              <div className="flex justify-end gap-3 w-full">
                <Button className="bg-red-500" type="button" onClick={onDelete}>
                  Elimina
                </Button>
                <Button type="submit" disabled={!isDirty()}>
                  Aggiorna
                </Button>
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
