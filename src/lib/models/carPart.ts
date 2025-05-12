export type CarPart = {
  id: string;
  name: string;
  numbers: string[];
  photos: string[];
  carId: string;
  carBrand: string;
  carModel: string;
  carSetup: string;
  category: string;
  description: string;
  warranty: number; // in month
  price: number; // in €
  status: "available" | "sold";
  compatibleCars: string[];
  lastUpdated: string; // timestamp
  adHocShippingCosts?: number;
};
