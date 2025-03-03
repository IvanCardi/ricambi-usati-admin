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
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CarSelection } from "./car-selection";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  numbers: z.array(z.string().nonempty()).nonempty(),
  warranty: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().min(0)
  ),
  price: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().min(0)
  ),
  compatibleCars: z.array(z.string().nonempty()),
  photos: z.array(z.instanceof(File)),
});

export function CarPartForm({
  cars,
  selectedCarId,
}: {
  cars: Car[];
  selectedCarId: string | undefined;
}) {
  const [selectedCar, setSelectedCar] = useState<Car | undefined>(
    selectedCarId ? cars.find((c) => c.id === selectedCarId) : undefined
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      numbers: [],
      compatibleCars: [],
      price: 0,
      warranty: 0,
      photos: [],
    },
  });

  const [numbersInputValue, setNumbersInputValue] = useState("");
  const [compatibleCarsInputValue, setCompatibleCarsInputValue] = useState("");
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    /*  const result = await submit(values);

    if (result.status === "error") {
      toast("Si è verificato un errore", {
        description: result.message,
      });
    } else {
      toast("Macchina aggiunta con successo");
      router.push("/cars");
    }  */
  };

  return (
    <div className="w-[50%] m-auto flex flex-col gap-5">
      <CarSelection
        cars={cars}
        selectedCar={selectedCar}
        setSelectedCar={setSelectedCar}
        disabled={!!selectedCarId && !!cars.find((c) => c.id === selectedCarId)}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full m-auto"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numbers"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Numeri di parte</FormLabel>
                <FormControl className="flex">
                  <Input
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
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Prezzo</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
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
                  <Input type="number" {...field} />
                </FormControl>
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
                <div className="flex flex-col gap-2">
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
          <FormField
            control={form.control}
            name="photos"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Foto</FormLabel>
                <FormControl>
                  <Input
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
                <div className="flex space-x-2">
                  {photoPreviews.map((src, idx) => (
                    <Image
                      key={idx}
                      src={src}
                      width={64}
                      height={64}
                      alt={`Preview ${idx}`}
                      className="object-cover"
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
