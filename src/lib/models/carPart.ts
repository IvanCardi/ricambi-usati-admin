export type CarPart = {
  id: string;
  name: string;
  numbers: string[];
  photos: string[];
  carId: string;
  category: string;
  description: string;
  warranty: number; // in month
  price: number; // in €
  status: string; // "available", "pending payment", "sold"
  compatibleCars: string[];
  lastUpdated: string; // timestamp
};
