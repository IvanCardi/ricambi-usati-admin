export type Order = {
  id: string;
  customer:
    | {
        id: string;
        type: "private";
        firstName: string;
        lastName: string;
      }
    | { id: string; type: "company"; name: string };
  address: Address;
  products: {
    id: string;
    name: string;
    price: number;
    discountedPrice?: number;
  }[];
  status: "created" | "in payment" | "paid" | "shipped";
  totalPrice: number;
  createdAt: string;
};

export type Address = {
  street: string;
  number: string;
  zipCode: string;
  province: string;
  city: string;
  state: string;
};
